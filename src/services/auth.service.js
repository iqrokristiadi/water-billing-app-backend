import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import AppError from "../utils/appError.js"; // you already have this
import bcrypt from "bcrypt";

export const registerUser = async (
  name,
  email,
  password,
  role = "customer"
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already registered", 400);

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id, user.role);

  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = generateToken(user._id, user.role);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user, token };
};
