import AppError from "../utils/appError.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  let { statusCode, message } = err;

  // Default values if missing
  statusCode = statusCode || 500;
  message = message || "Internal Server Error";

  // 🧠 Handle MongoDB duplicate key errors (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const value = err.keyValue ? err.keyValue[field] : "";
    message = `Duplicate value "${value}" for field "${field}". Please use another value.`;
    statusCode = 400;
  }

  // 🧩 Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Validation error: ${errors.join(", ")}`;
    statusCode = 400;
  }

  // 🧩 Handle invalid ObjectId or casting errors
  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // Send structured response
  res.status(statusCode).json({
    status: err.status || "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
