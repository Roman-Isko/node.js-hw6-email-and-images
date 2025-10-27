import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';

const router = Router();

/**
 * POST /auth/register
 * POST /auth/login
 * POST /auth/refresh
 * POST /auth/logout
 */
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);

export default router;
