import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import AppError from "./utils/appError.js";
import errorHandler from "./middlewares/error.middleware.js";
import { successResponse } from "./utils/response.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import usageRoutes from "./routes/usage.routes.js";

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/usages", usageRoutes);

// Health check route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// Example test route using successResponse
app.get("/api/v1/test", (req, res) => {
  const data = { name: "Water Billing API", version: "1.0.0" };
  return successResponse(res, "API info fetched successfully", data);
});

// Example test route to trigger error
app.get("/api/v1/error", (req, res, next) => {
  next(new AppError("This is a test error", 400));
});

// Handle unmatched routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler (MUST be last)
app.use(errorHandler);

export default app;
