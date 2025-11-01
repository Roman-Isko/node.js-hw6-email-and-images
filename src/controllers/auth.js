import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import config from '../config/index.js';
import * as authService from '../services/auth.js';

/**
 * POST /auth/register
 */
export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.createUser({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/login
 */
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) throw createHttpError(401, 'Email or password is wrong');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw createHttpError(401, 'Email or password is wrong');

    const { accessToken, refreshToken } = await authService.createSession(
      user._id,
    );

    res.cookie(config.cookie.refreshCookieName, refreshToken, {
      ...config.cookie.refreshCookieOptions,
      maxAge: config.jwt.refreshExpiresInSec * config.MS_IN_SEC,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/refresh
 */
export const refreshController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies[config.cookie.refreshCookieName];
    if (!refreshToken) throw createHttpError(401, 'Not authorized');

    const { userId } = await authService.verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } =
      await authService.createSession(userId);

    res.cookie(config.cookie.refreshCookieName, newRefreshToken, {
      ...config.cookie.refreshCookieOptions,
      maxAge: config.jwt.refreshExpiresInSec * config.MS_IN_SEC,
    });

    res.status(200).json({
      status: 200,
      message: 'Session successfully refreshed!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/logout
 */
export const logoutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies[config.cookie.refreshCookieName];
    if (!refreshToken) throw createHttpError(401, 'Not authorized');

    await authService.deleteSessionByRefreshToken(refreshToken);

    res.clearCookie(config.cookie.refreshCookieName);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/**
 * GET /auth/current
 */
export const getCurrentUserController = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authorized');
    }

    res.status(200).json({
      status: 200,
      message: 'Current user fetched successfully',
      data: {
        name: req.user.name,
        email: req.user.email,
        subscription: req.user.subscription || 'free',
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/reset-password
 */
export const resetPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) throw createHttpError(404, 'User not found');

    const resetToken = await authService.createPasswordResetToken(user._id);

    res.status(200).json({
      status: 200,
      message: 'Password reset link sent to email!',
      data: { resetToken },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/send-reset-email
 */
export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    await authService.sendResetEmail(email);

    res.status(200).json({
      status: 200,
      message: 'Password reset email sent successfully',
    });
  } catch (err) {
    next(err);
  }
};
