// import express from 'express';
// import { sendMail } from '../services/email.js';

// const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     const key = req.query.key;
//     if (
//       process.env.NODE_ENV === 'production' &&
//       key !== process.env.TEST_EMAIL_KEY
//     ) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     const to = req.query.to;

//     if (!to) {
//       return res.status(400).json({
//         message: 'Будь ласка, вкажи email у параметрі ?to=',
//         example: '/api/test-email?to=your_email@gmail.com',
//       });
//     }

//     await sendMail({
//       to,
//       subject: 'Тестовий лист із Node.js',
//       text: 'Привіт! Це тестове повідомлення з твого SMTP-сервера',
//       html: `
//         <h2>Привіт 👋</h2>
//         <p>Це тестовий лист, який підтверджує, що SMTP-з’єднання працює.</p>
//         <p><b>Якщо ти бачиш це — все налаштовано правильно!</b></p>
//       `,
//     });

//     res.json({ message: `✅ Лист успішно надіслано на ${to}` });
//   } catch (error) {
//     console.error('❌ Помилка при надсиланні листа:', error);
//     res.status(500).json({
//       message: 'Помилка при надсиланні листа',
//       error: error.message,
//     });
//   }
// });

// export default router;
