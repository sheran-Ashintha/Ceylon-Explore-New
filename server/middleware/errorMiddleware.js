function getStatusCode(err) {
  if (err.statusCode || err.status) {
    return err.statusCode || err.status;
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    return 400;
  }

  if (err.name === "SyntaxError" && err.type === "entity.parse.failed") {
    return 400;
  }

  if (err.code === 11000) {
    return 400;
  }

  return 500;
}

function getMessage(err, statusCode) {
  if (err.code === 11000) {
    return "A record with one of these unique values already exists.";
  }

  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    return "Internal server error.";
  }

  return err.message || "Internal server error.";
}

function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = getStatusCode(err);
  const payload = {
    message: getMessage(err, statusCode),
  };

  if (statusCode === 500 && process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  errorHandler,
  notFound,
};