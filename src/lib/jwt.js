// src/lib/jwt.js
// import jwt from 'jsonwebtoken';

// export const signResetToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
// };

// export const verifyResetToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

// src/lib/jwt.js
import jwt from 'jsonwebtoken';

const RESET_EXPIRES = '5m'; // 5 хвилин

export const signResetToken = (payload) => {
  const secret = process.env.JWT_RESET_SECRET ?? process.env.JWT_ACCESS_SECRET;
  return jwt.sign(payload, secret, { expiresIn: RESET_EXPIRES });
};

export const verifyResetToken = (token) => {
  const secret = process.env.JWT_RESET_SECRET ?? process.env.JWT_ACCESS_SECRET;
  return jwt.verify(token, secret);
};
