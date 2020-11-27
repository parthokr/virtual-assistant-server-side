const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const { sendMail } = require('./sendmail');
app.use(express.json());
app.listen(3000, () => {
    console.log("Listening on 3000");
});
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'virtual_assistant'
});

db.connect(err => {
    if(err) throw err;
});
console.log("Connected to mysql...");
const saveUser = (postData) => {
    let sql = "INSERT INTO user_info SET ?";
    let query = db.query(sql, postData, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
}
app.post('/signup', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let postData = {
        username,
        email,
        password,
        "activated": false
    }
    db.query("SELECT * FROM user_info WHERE username=? OR email=?", [username, email], (err, users) => {
        if(users.length==0)
        {
            bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) throw err;
                postData["password"] = hash;
                saveUser(postData);
                let sql = "SELECT * FROM user_info WHERE username = ?";
                db.query(sql, [username], (err, results) => {
                let confirmationCode = "INSERT INTO confirmation_code SET ?";
                let code = Math.floor(Math.random() * Math.floor(999999));
                db.query(
                    confirmationCode,
                    { user_id: results[0].id, code },
                    (err, result) => {
                    if (err) throw err;
                    // send confirmation code via email
                    //   sendMail(email, username, code);
                    res.json({ signed_up: true, id: results[0].id });
                    }
                );
                });
            });
            });
        }else{
            res.json({"signed_up": false});
        }
    });
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql = "SELECT * FROM user_info WHERE username = ?";
    let query = db.query(sql, [username], (err, results) => {
        if(results.length == 0)
            res.json({ logged_in: false, error: "username_not_found" });
        if (err) throw err;
        console.log(results[0].id);
        // res.send("Done");
        bcrypt.compare(password, results[0].password, (err, result) => {
            if(result)
            {
                if(results[0].activated)
                    res.json({'logged_in':true, 'id': results[0].id, 'activated': true});
                else
                    res.json({'logged_in':true, 'id': results[0].id, 'activated': false});
            }else{
                res.json({'logged_in': false, 'error': "auth_error"});
            }
        });
    });
});

app.post('/verify', (req, res) => {
    let user_id = req.body.id;
    let code = req.body.code || "";
    let sql = "SELECT * FROM confirmation_code WHERE user_id = ?";
    let query = db.query(sql, [user_id], (err, results) => {
        if(results[0].code==code)
        {
            // update activtaed column as true
            db.query("UPDATE user_info SET activated=1 WHERE id=?",
            [user_id],
            (err, result) => {
                if(err) throw err;
                res.json({ matched: true });
            }        
            );
        }else{
            res.json({"matched": false})
        }
        // if (results.length == 0)
        // res.json({ logged_in: false, error: "username_not_found" });
        // if (err) throw err;
        // console.log(results[0].id);
        // // res.send("Done");
        // bcrypt.compare(password, results[0].password, (err, result) => {
        // if (result) {
        //     res.json({ logged_in: true, id: results[0].id });
        // } else {
        //     res.send({ logged_in: false, error: "auth_error" });
        // }
        // });
    });
})
