import User from "../models/user.model.js";
import { successResponse } from "../utils/response.js";
import AppError from "../utils/appError.js";

// Get current user's profile
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    return successResponse(res, "User profile fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

// Update current user's profile (optional for now)
export const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ["name", "email"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field]) updates[field] = req.body[field];
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return successResponse(res, "Profile updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};
