const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    // port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: 'camaphoot@gmail.com',
      pass: 'sdrrdlgabgfqpqyq',
    },
  });

  const message = {
    from: `camaphoot <camaphoot@gmail.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
