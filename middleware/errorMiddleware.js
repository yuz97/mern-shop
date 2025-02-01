export const notFound = (err, req, res, next) => {
  const error = new Error(`path tidak ditemukan ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name == "ValidationError") {
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");

    statusCode = 400;
  }

  res.status(statusCode).json({
    message,
    stack: err.stack,
  });
};
