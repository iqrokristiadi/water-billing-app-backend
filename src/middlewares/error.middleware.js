import AppError from "../utils/appError.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  let { statusCode, message } = err;

  // Default values if missing
  statusCode = statusCode || 500;
  message = message || "Internal Server Error";

  // Send structured response
  res.status(statusCode).json({
    status: err.status || "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
