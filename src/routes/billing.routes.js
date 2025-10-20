// src/routes/billing.routes.js
import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import {
  createBilling,
  updateBilling,
  getBillings,
  getBilling,
} from "../controllers/billing.controller.js";

const router = express.Router();

router.use(protect);

// GET all / Create new billing (admin/staff only)
router
  .route("/")
  .get(restrictTo("admin", "staff"), getBillings)
  .post(restrictTo("admin", "staff"), createBilling);

// Get or update billing by ID
router
  .route("/:id")
  .get(restrictTo("admin", "staff"), getBilling)
  .patch(restrictTo("admin", "staff"), updateBilling);

export default router;
