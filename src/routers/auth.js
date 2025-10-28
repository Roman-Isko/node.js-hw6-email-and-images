// import { Router } from 'express';
// import {
//   registerController,
//   loginController,
//   refreshController,
//   logoutController,
// } from '../controllers/auth.js';

// const router = Router();

// /**
//  * POST /auth/register
//  * POST /auth/login
//  * POST /auth/refresh
//  * POST /auth/logout
//  */
// router.post('/register', registerController);
// router.post('/login', loginController);
// router.post('/refresh', refreshController);
// router.post('/logout', logoutController);

// export default router;

///////////////////////////////////////////////////////////////////////////

// src/routes/auth.js
import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  getCurrentUserController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import {
  registerSchema,
  loginSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../schemas/authSchemas.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

// 🔹 Реєстрація
router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

// 🔹 Логін
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

// 🔹 Логаут
router.post('/logout', authenticate, ctrlWrapper(logoutController));

// 🔹 Поточний користувач
router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

// 🔹 Надіслати лист для скиду пароля
router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

// 🔹 Скидання пароля
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;

///////////////////////////////////////////////////////////////////////////

// import express from 'express';
// import createHttpError from 'http-errors';
// import Joi from 'joi';
// import { sendMail } from '../services/email.js';
// import { signResetToken, verifyResetToken } from '../lib/jwt.js';
// import User from '../models/user.js'; // підстав свій шлях
// import Session from '../models/session.js'; // якщо є
// import { validateBody } from '../middlewares/validateBody.js';
// import bcrypt from 'bcrypt';

// const router = express.Router();

// const sendResetSchema = Joi.object({
//   email: Joi.string().email().required(),
// });

// router.post(
//   '/send-reset-email',
//   validateBody(sendResetSchema),
//   async (req, res, next) => {
//     try {
//       const { email } = req.body;
//       const user = await User.findOne({ email });
//       if (!user) throw createHttpError(404, 'User not found!');

//       const token = signResetToken({ email: user.email });

//       const appDomain = (process.env.APP_DOMAIN || '').replace(/\/$/, '');
//       const resetUrl = `${appDomain}/reset-password?token=${token}`;

//       const html = `
//         <p>Hello,</p>
//         <p>To reset your password click the link below (valid for 5 minutes):</p>
//         <p><a href="${resetUrl}">Reset password</a></p>
//       `;

//       try {
//         await sendMail({
//           to: user.email,
//           subject: 'Password reset',
//           html,
//           text: `Reset your password: ${resetUrl}`,
//         });
//       } catch (err) {
//         console.error('Mail error:', err);
//         throw createHttpError(
//           500,
//           'Failed to send the email, please try again later.',
//         );
//       }

//       res.status(200).json({
//         status: 200,
//         message: 'Reset password email has been successfully sent.',
//         data: {},
//       });
//     } catch (err) {
//       next(err);
//     }
//   },
// );

// const resetPwdSchema = Joi.object({
//   token: Joi.string().required(),
//   password: Joi.string().min(6).required(),
// });

// router.post(
//   '/reset-pwd',
//   validateBody(resetPwdSchema),
//   async (req, res, next) => {
//     try {
//       const { token, password } = req.body;
//       let payload;
//       try {
//         payload = verifyResetToken(token);
//       } catch (err) {
//         throw createHttpError(401, 'Token is expired or invalid.');
//       }

//       const user = await User.findOne({ email: payload.email });
//       if (!user) throw createHttpError(404, 'User not found!');

//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);

//       // опціонально: поле для інвалідизації старих токенів
//       user.passwordChangedAt = new Date();

//       await user.save();

//       // Видалення сесій, якщо ви їх зберігаєте
//       try {
//         if (Session) {
//           await Session.deleteMany({ user: user._id });
//         }
//       } catch (err) {
//         console.warn('Failed to delete sessions:', err);
//       }

//       res.status(200).json({
//         status: 200,
//         message: 'Password has been successfully reset.',
//         data: {},
//       });
//     } catch (err) {
//       next(err);
//     }
//   },
// );

// export default router;
