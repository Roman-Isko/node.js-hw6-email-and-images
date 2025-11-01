import jwt from 'jsonwebtoken';

const RESET_EXPIRES = '5m';

export const signResetToken = (payload) => {
  const secret = process.env.JWT_RESET_SECRET ?? process.env.JWT_ACCESS_SECRET;
  return jwt.sign(payload, secret, { expiresIn: RESET_EXPIRES });
};

export const verifyResetToken = (token) => {
  const secret = process.env.JWT_RESET_SECRET ?? process.env.JWT_ACCESS_SECRET;
  return jwt.verify(token, secret);
};
