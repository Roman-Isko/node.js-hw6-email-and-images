import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import User from '../models/user.js';
import Session from '../models/session.js';
import config from '../config/index.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email }).exec();
};

export const createUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw createHttpError(409, 'Email already in use');

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const user = await User.create({ name, email, password: hashedPassword });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const createSession = async (userId) => {
  await Session.findOneAndDelete({ userId });

  const accessTokenValidUntil = new Date(
    Date.now() + config.jwt.accessExpiresInSec * 1000,
  );
  const refreshTokenValidUntil = new Date(
    Date.now() + config.jwt.refreshExpiresInSec * 1000,
  );

  const accessToken = jwt.sign({ id: userId }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresInSec,
  });

  const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresInSec,
  });

  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({
    userId: decoded.id,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');

  return { userId: decoded.id };
};

export const deleteSessionByRefreshToken = async (refreshToken) => {
  await Session.findOneAndDelete({ refreshToken });
};
