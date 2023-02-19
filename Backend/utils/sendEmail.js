const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  const { email, subject, message } = options;

  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    host: process.env.NODEMAILER_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_MAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_MAIL,
    to: email,
    subject: subject,
    text: message,
  };
  await transporter.sendMail(mailOptions);
};

//https://stackoverflow.com/questions/59188483/error-invalid-login-535-5-7-8-username-and-password-not-accepted
