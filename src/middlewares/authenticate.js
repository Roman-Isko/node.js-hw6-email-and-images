import createHttpError from 'http-errors';
import { verifyAccess } from '../utils/jwt.js';
import Session from '../models/session.js';
import User from '../models/user.js';

/**
 * Middleware: reads Authorization header Bearer <token>
 * Verifies JWT and checks session TTL in DB
 * Attaches req.user (without password) and req.session
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization') || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Not authorized');
    }

    let payload;
    try {
      payload = verifyAccess(token);
    } catch (err) {
      if (err && err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const session = await Session.findOne({ accessToken: token }).exec();
    if (!session) throw createHttpError(401, 'Session not found');

    if (session.accessTokenValidUntil < new Date()) {
      await Session.deleteOne({ _id: session._id }).exec();
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(payload._id).select('-password').exec();
    if (!user) throw createHttpError(401, 'User not found');

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;
