import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getMyCustomerProfile,
} from "../controllers/customer.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCustomerValidation,
  updateCustomerValidation,
  getCustomersValidation,
} from "../validations/customer.validation.js";

const router = express.Router();

// Protect all customer routes
router.use(protect);

// Customer self-view (must come before :id)
router.route("/me").get(restrictTo("customer"), getMyCustomerProfile);

// Admin or staff can manage customers
router
  .route("/")
  .post(
    restrictTo("admin", "staff"),
    validate(createCustomerValidation), // 👈 validation before controller
    createCustomer
  )
  .get(
    restrictTo("admin", "staff"),
    validate(getCustomersValidation), // 👈 validation before controller
    getAllCustomers
  );

router
  .route("/:id")
  .get(restrictTo("admin", "staff"), getCustomerById)
  .patch(
    restrictTo("admin", "staff"),
    validate(updateCustomerValidation), // 👈 validation before controller
    updateCustomer
  )
  .delete(restrictTo("admin", "staff"), deleteCustomer);

export default router;
