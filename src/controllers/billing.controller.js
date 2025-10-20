import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import {
  createBillingForUsage,
  updateBillingStatus,
  getAllBillings,
  getBillingById,
} from "../services/billing.service.js";

// POST /api/billing
export const createBilling = asyncHandler(async (req, res) => {
  const billing = await createBillingForUsage(req.body.usageId);
  return successResponse(res, "Billing created successfully", billing, 201);
});

// PATCH /api/billing/:id/status
export const updateBilling = asyncHandler(async (req, res) => {
  const billing = await updateBillingStatus(req.params.id, req.body.status);
  return successResponse(res, "Billing status updated", billing);
});

// GET /api/billing
export const getBillings = asyncHandler(async (req, res) => {
  const billings = await getAllBillings();
  return successResponse(res, "Billing list retrieved", billings);
});

// GET /api/billing/:id
export const getBilling = asyncHandler(async (req, res) => {
  const billing = await getBillingById(req.params.id);
  return successResponse(res, "Billing details retrieved", billing);
});
