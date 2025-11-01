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

// Реєстрація
router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

// Логін
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

// Логаут
router.post('/logout', authenticate, ctrlWrapper(logoutController));

// Поточний користувач
router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

// Надіслати лист для скиду пароля
router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

// Скидання пароля
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
