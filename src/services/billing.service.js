// src/services/billing.service.js
import Billing from "../models/billing.model.js";
import Usage from "../models/usage.model.js";
import AppError from "../utils/appError.js";

/**
 * Create a billing record from a usage record
 */
export const createBillingForUsage = async (usageId) => {
  const usage = await Usage.findById(usageId).populate("customer");
  if (!usage) throw new AppError("Usage record not found", 404);

  // Prevent duplicate billing for the same usage
  const existingBill = await Billing.findOne({ usage: usage._id });
  if (existingBill)
    throw new AppError("Billing already exists for this usage", 400);

  // Create billing document
  const billing = await Billing.create({
    customer: usage.customer._id,
    usage: usage._id,
    month: usage.month,
    year: usage.year,
    totalUsage: usage.usage, // use from Usage model
    // unitPrice & baseFee will use defaults unless overridden
  });

  return billing;
};

/**
 * Update billing status (e.g. mark as paid)
 */

export const updateBillingStatus = async (billingId, status) => {
  const billing = await Billing.findById(billingId);
  if (!billing) throw new AppError("Billing not found", 404);

  billing.status = status;

  if (status === "paid") {
    billing.paidAt = new Date();
  } else {
    billing.paidAt = null;
  }

  await billing.save();
  return billing;
};

/**
 * Get all billing records (optional filter)
 */

export const getAllBillings = async (filter = {}) => {
  const billings = await Billing.find(filter)
    .populate("customer", "name address")
    .populate("usage", "usage month year");
  return billings;
};

/**
 * Get single billing record
 */

export const getBillingById = async (billingId) => {
  const billing = await Billing.findById(billingId)
    .populate("customer", "name address")
    .populate("usage", "usage month year");
  if (!billing) throw new AppError("Billing not found", 404);
  return billing;
};
