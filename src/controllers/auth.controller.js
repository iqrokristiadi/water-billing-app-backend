import { registerUser, loginUser } from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const { user, token } = await registerUser(name, email, password, role);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export const logout = catchAsync(async (req, res, next) => {
  // On backend-only API, "logout" just clears token client-side
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
