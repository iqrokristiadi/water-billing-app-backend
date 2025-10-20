import Usage from "../models/usage.model.js";
import Customer from "../models/customer.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";
import APIFeatures from "../utils/apiFeatures.js";

/*
  @desc   Create new usage record
  @route  POST /api/v1/usages
  @access Admin, Staff
*/
export const createUsage = asyncHandler(async (req, res, next) => {
  const { customer, previousReading, currentReading, month, year } = req.body;

  // Check if customer exists
  const existingCustomer = await Customer.findById(customer);
  if (!existingCustomer) {
    return next(new AppError("Customer not found", 404));
  }

  // Prevent duplicate usage for same period
  const existingUsage = await Usage.findOne({ customer, month, year });
  if (existingUsage) {
    return next(new AppError("Usage for this month already exists", 400));
  }

  // Create (auto-calculation happens in schema)
  const newUsage = await Usage.create({
    customer,
    previousReading,
    currentReading,
    month,
    year,
  });

  return successResponse(
    res,
    "Usage record created successfully",
    newUsage,
    201
  );
});

/*
  @desc   Get all usage records
  @route  GET /api/v1/usages
  @access Admin, Staff
*/

export const getAllUsages = asyncHandler(async (req, res, next) => {
  const baseQuery = Usage.find().populate("customer", "name meterNumber");

  const features = new APIFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const usages = await features.query;
  const total = await Usage.countDocuments();

  return successResponse(res, "Usages fetched successfully", {
    total,
    results: usages.length,
    usages,
  });
});

/*
  @desc   Get usage by ID
  @route  GET /api/v1/usages/:id
  @access Admin, Staff
*/

export const getUsageById = asyncHandler(async (req, res, next) => {
  const usage = await Usage.findById(req.params.id).populate(
    "customer",
    "name meterNumber"
  );

  if (!usage) {
    return next(new AppError("Usage not found", 404));
  }

  return successResponse(res, "Usage fetched successfully", usage);
});

/*
  @desc   Update usage record
  @route  PATCH /api/v1/usages/:id
  @access Admin, Staff
*/

export const updateUsage = async (req, res, next) => {
  try {
    const { previousReading, currentReading } = req.body;

    const usage = await Usage.findById(req.params.id);
    if (!usage) return next(new AppError("Usage not found", 404));

    // 🧠 Validate before updating
    if (
      currentReading !== undefined &&
      previousReading !== undefined &&
      currentReading < previousReading
    ) {
      return next(
        new AppError(
          "Validation error: Current reading cannot be less than previous reading",
          400
        )
      );
    }

    // Update values safely
    if (previousReading !== undefined) usage.previousReading = previousReading;
    if (currentReading !== undefined) usage.currentReading = currentReading;

    // Auto-calculate usage and inactive flag
    usage.usage = usage.currentReading - usage.previousReading;
    usage.isInactive = usage.usage === 0;

    await usage.save();

    res.status(200).json({
      status: "success",
      message: "Usage updated successfully",
      data: usage,
    });
  } catch (error) {
    next(error);
  }
};

/*
  @desc   Delete usage record
  @route  DELETE /api/v1/usages/:id
  @access Admin, Staff
*/

export const deleteUsage = asyncHandler(async (req, res, next) => {
  const usage = await Usage.findByIdAndDelete(req.params.id);

  if (!usage) {
    return next(new AppError("Usage not found", 404));
  }

  return successResponse(res, "Usage deleted successfully", null);
});
