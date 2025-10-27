import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const { jwt: jwtConfig } = config;

export function signAccess(payload) {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresInSec,
  });
}

export function signRefresh(payload) {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresInSec,
  });
}

export function verifyAccess(token) {
  return jwt.verify(token, jwtConfig.accessSecret);
}

export function verifyRefresh(token) {
  return jwt.verify(token, jwtConfig.refreshSecret);
}
