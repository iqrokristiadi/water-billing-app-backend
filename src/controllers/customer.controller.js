import Customer from "../models/customer.model.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
  @desc Create new customer
  @route POST /api/v1/customers
  @access Admin, Staff
 */

export const createCustomer = asyncHandler(async (req, res, next) => {
  const { name, address, phone, email, meterNumber, user } = req.body;

  const existingMeter = await Customer.findOne({ meterNumber });
  if (existingMeter) {
    return next(new AppError("Meter number already exists", 400));
  }

  const newCustomer = await Customer.create({
    name,
    address,
    phone,
    email,
    meterNumber,
    user,
  });

  return successResponse(
    res,
    "Customer created successfully",
    newCustomer,
    201
  );
});

/*
  @desc Get all customers
  @route GET /api/v1/customers
  @access Admin, Staff
 */

export const getAllCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find().populate("user", "name email role");
  return successResponse(res, "Customers fetched successfully", customers);
});

/*
  @desc Get customer by ID
  @route GET /api/v1/customers/:id
  @access Admin, Staff
 */

export const getCustomerById = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id).populate(
    "user",
    "name email role"
  );

  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  return successResponse(res, "Customer fetched successfully", customer);
});

/*
 @desc Update customer
 @route PATCH /api/v1/customers/:id
 @access Admin, Staff
 */

export const updateCustomer = asyncHandler(async (req, res, next) => {
  const updates = req.body;
  const customer = await Customer.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  return successResponse(res, "Customer updated successfully", customer);
});

/*
 @desc Delete customer
 @route DELETE /api/v1/customers/:id
 @access Admin, Staff
 */

export const deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  return successResponse(res, "Customer deleted successfully", null);
});

/*
 @desc Get logged-in customer's info
 @route GET /api/v1/customers/me
 @access Customer
 */

export const getMyCustomerProfile = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user._id }).populate(
    "user",
    "name email role"
  );

  if (!customer) {
    return next(new AppError("Customer profile not found", 404));
  }

  return successResponse(
    res,
    "Customer profile fetched successfully",
    customer
  );
});
