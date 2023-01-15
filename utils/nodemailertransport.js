import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendMail = (email, subject, message, cb = () => {}) => {
  const mailOptions = {
    from: "ECC",
    to: email,
    subject,
    html: message,
  };
  let result;
  transporter.sendMail(mailOptions, cb);
};

