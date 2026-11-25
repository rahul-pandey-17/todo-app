import ApiError from '../utils/error.js';

const globalErrorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    console.error('ApiError:', err);

    if (err.internalMessage) {
      console.error('Internal message:', err.internalMessage);
    }

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details !== null && { details: err.details }),
    });
  }

  console.error('ServerError:', err);

  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};

export default globalErrorHandler;
