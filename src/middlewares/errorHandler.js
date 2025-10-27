export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    status: 'error',
    message,
  });
};
