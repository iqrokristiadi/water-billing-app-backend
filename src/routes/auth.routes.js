import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/logout", logout);

export default router;
