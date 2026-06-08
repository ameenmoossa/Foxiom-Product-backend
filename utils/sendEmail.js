// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Gmail App Password
//   },
// });

// exports.sendEmail = async (to, subject, text) => {
//   await transporter.sendMail({
//     from: `"Foxiom IT Hub" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html: `
//       <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
//         <h2 style="color:#1B4F8A">Foxiom IT Product Hub</h2>
//         <p>Your OTP for password reset:</p>
//         <h1 style="letter-spacing:8px;color:#1B4F8A">${text.replace('Your OTP is: ', '')}</h1>
//         <p style="color:#6b7280;font-size:13px">This OTP expires in 10 minutes. Do not share it with anyone.</p>
//       </div>
//     `,
//   });
// };

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: `"Foxiom IT Hub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
  console.log('Email sent:', info.messageId);
};