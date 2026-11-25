class ApiError extends Error {
  constructor({
    statusCode = 500,
    message = 'Something went wrong',
    internalMessage = null,
    details = null,
  } = {}) {
    super(message);

    this.name = new.target.name;
    this.statusCode = statusCode;
    this.internalMessage = internalMessage;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
