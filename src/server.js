import express from 'express';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/Contacts.js';
import authRouter from './routers/auth.js';
// import testEmailRouter from './routers/testEmailRouter.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

/**
 * Створює та налаштовує express-сервер
 * Не запускає порт — це робиться в index.js
 */
export default function setupServer() {
  const app = express();

  // --- Middleware ---
  app.use(express.json());
  app.use(cookieParser());

  // --- Routes ---
  app.use('/api/auth', authRouter);
  app.use('/api/contacts', contactsRouter);
  // app.use('/api/test-email', testEmailRouter);

  // --- Error Handlers ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
