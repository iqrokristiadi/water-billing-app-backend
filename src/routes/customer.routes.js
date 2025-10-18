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

const router = express.Router();

// Protect all customer routes
router.use(protect);

// Customer self-view (must come before :id)
router.route("/me").get(restrictTo("customer"), getMyCustomerProfile);

// Admin or staff can manage customers
router
  .route("/")
  .post(restrictTo("admin", "staff"), createCustomer)
  .get(restrictTo("admin", "staff"), getAllCustomers);
router
  .route("/:id")
  .get(restrictTo("admin", "staff"), getCustomerById)
  .patch(restrictTo("admin", "staff"), updateCustomer)
  .delete(restrictTo("admin", "staff"), deleteCustomer);

export default router;
