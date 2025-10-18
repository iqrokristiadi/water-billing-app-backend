import express from "express";
import { getMe, updateMe } from "../controllers/user.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Get logged-in user's info
router.get("/me", getMe);

// (Optional for later) Update logged-in user's profile
router.patch("/me", updateMe);

// Only admin can access this route
router.get("/admin-only", protect, restrictTo("admin"), (req, res) => {
  res.json({
    status: "success",
    message: `Welcome admin ${req.user.name}`,
  });
});

export default router;
