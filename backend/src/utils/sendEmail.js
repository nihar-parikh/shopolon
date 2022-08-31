// import nodeMailer from "nodemailer";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (options) => {
  //   const transporter = nodeMailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     service: process.env.SMTP_SERVICE,
  //     auth: {
  //       user: process.env.SMTP_MAIL,
  //       pass: process.env.SMTP_PASSWORD,
  //     },
  //   });
  //   const mailOptions = {
  //     from: process.env.SMTP_MAIL,
  //     to: options.email,
  //     subject: options.subject,
  //     text: options.message,
  //   };

  //   await transporter.sendMail(mailOptions);

  await sgMail.send({
    to: options.email,
    from: process.env.SMPT_MAIL,
    subject: options.subject,
    text: options.message,
    // html: `<a href="http://localhost:3000/reset-password/${id}">Click here</a>`,
  });
};
