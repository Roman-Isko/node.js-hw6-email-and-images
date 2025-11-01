import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  APP_DOMAIN,
} = process.env;

// Створюємо транспортер для SMTP
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

// Перевірка з’єднання при старті (опціонально)
transporter
  .verify()
  .then(() => console.log('✅ SMTP transporter is ready'))
  .catch((err) =>
    console.error('❌ SMTP transporter verification failed:', err),
  );

// Основна функція для відправки листів
export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
      text,
    });
    console.log('✉️ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

// Функція спеціально для листів скидання пароля
export const sendResetEmail = async (email, token) => {
  if (!APP_DOMAIN) throw new Error('APP_DOMAIN is not defined in .env');

  const appDomain = APP_DOMAIN.replace(/\/$/, '');
  const safeToken = encodeURIComponent(token);
  const resetLink = `${appDomain}/reset-password?token=${safeToken}`;

  const html = `
    <p>Hello,</p>
    <p>Click the link below to reset your password. The link is valid for 5 minutes.</p>
    <p><a href="${resetLink}">Reset your password</a></p>
    <p>If you didn't request this, ignore this email.</p>
  `;

  const text = `Reset your password: ${resetLink}\n\nThis link is valid for 5 minutes.`;

  return sendMail({ to: email, subject: 'Password Reset Request', html, text });
};
