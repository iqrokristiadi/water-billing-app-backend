import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string().valid("admin", "staff", "customer").optional(),
});

export const loginValidation = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});
