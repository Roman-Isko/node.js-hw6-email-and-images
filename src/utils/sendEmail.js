import nodemailer from 'nodemailer';
import config from '../config/index.js';

/**
 * Відправка email через Nodemailer
 * @param {{ to: string, subject: string, html: string }} options
 */
export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  const mailOptions = {
    from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
