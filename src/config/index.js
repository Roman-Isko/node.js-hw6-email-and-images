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

const app = {
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

const email = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  fromName: 'Support Team',
  fromEmail: process.env.EMAIL_FROM || process.env.EMAIL_USER,
};

export default {
  env,
  jwt,
  cookie,
  bcrypt,
  app,
  email,
  MS_IN_SEC,
};
