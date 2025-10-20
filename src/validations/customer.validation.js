// src/validators/customer.validator.js
import Joi from "joi";

export const createCustomerValidation = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  address: Joi.string().trim().min(5).max(100).required(),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(8)
    .max(20)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number can only contain digits, spaces, +, -, and ()",
    }),
  email: Joi.string().trim().email().lowercase().required(),
  meterNumber: Joi.string().trim().min(3).max(20).required(),
  user: Joi.string().required().label("User ID"),
});

export const updateCustomerValidation = Joi.object({
  name: Joi.string().trim().min(3).max(50).optional(),
  address: Joi.string().trim().min(5).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(8)
    .max(20)
    .optional(),
  email: Joi.string().trim().email().lowercase().optional(),
  meterNumber: Joi.string().trim().min(3).max(20).optional(),
});

export const getCustomersValidation = Joi.object({
  search: Joi.string().trim().allow("", null),
  sort: Joi.string().trim().allow("", null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  fields: Joi.string().trim().allow("", null),
});
