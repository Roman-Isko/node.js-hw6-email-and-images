import dotenv from 'dotenv';

dotenv.config();

const MS_IN_SEC = 1000;

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri:
    process.env.MONGODB_URI ||
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
};

const jwt = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-dev',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-dev',
  accessExpiresInSec: 15 * 60,
  refreshExpiresInSec: 30 * 24 * 3600,
};

const cookie = {
  refreshCookieName: 'refreshToken',
  refreshCookieOptions: {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'Strict',
  },
};

const bcrypt = {
  saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};

export default {
  env,
  jwt,
  cookie,
  bcrypt,
  MS_IN_SEC,
};
