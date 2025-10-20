import express from "express";
import {
  createUsage,
  getAllUsages,
  getUsageById,
  updateUsage,
  deleteUsage,
} from "../controllers/usage.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";
import {
  createUsageValidation,
  updateUsageValidation,
} from "../validations/usage.validation.js";

const router = express.Router();

// Protect all usage routes
router.use(protect);

// Admin or staff only
router
  .route("/")
  .post(
    restrictTo("admin", "staff"),
    validate(createUsageValidation),
    createUsage
  )
  .get(restrictTo("admin", "staff"), getAllUsages);

router
  .route("/:id")
  .get(restrictTo("admin", "staff"), getUsageById)
  .patch(
    restrictTo("admin", "staff"),
    validate(updateUsageValidation),
    updateUsage
  )
  .delete(restrictTo("admin", "staff"), deleteUsage);

export default router;
