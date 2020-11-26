let nodemailer = require("nodemailer");
let ejs = require("ejs");
const sendMail = (username, code) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "partho.kr18@gmail.com",
        pass: "sristy@#2018@#",
      },
    });

    ejs.renderFile(
      __dirname + "/email.ejs",
      { username, code },
      (err, data) => {
        if (err) throw err;
        let mailOptions = {
          from: "partho.kr18@gmail.com",
          to: "partho.rajvor2016@gmail.com",
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
