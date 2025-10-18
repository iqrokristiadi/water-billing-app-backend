import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const user = new User({
    name: "Test User",
    email: "test@example.com",
    password: "secret123",
    role: "admin",
  });

  await user.save();
  console.log("User saved:", user);

  const isMatch = await user.comparePassword("secret123");
  console.log("Password match:", isMatch);

  await mongoose.disconnect();
};

test();
