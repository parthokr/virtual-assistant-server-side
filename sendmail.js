/*
    * create config.json in root directory
   * add the following code and flesh out as per your info
                const config = {
                service: "gmail",
                auth: {
                  user: "john.doe@gmail.com",
                  pass: "yourpasswordhere",
                },
              };

              module.exports = {
                  config
              }
*/
const { config } = require('./config');
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const sendMail = (email, username, code) => {
    let transporter = nodemailer.createTransport(config);
    ejs.renderFile(
      __dirname + "/email.ejs",
      { username, code },
      (err, data) => {
        if (err) throw err;
        let mailOptions = {
          from: config.auth.user,
          to: email,
          subject: "Confirm your account at virtual assistant",
          html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
    );
}

module.exports = {
    sendMail
}
