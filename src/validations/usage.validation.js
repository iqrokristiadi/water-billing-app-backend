// src/validators/usage.validator.js
import Joi from "joi";

/*
  @desc Validation for creating a new usage record
*/
export const createUsageValidation = Joi.object({
  customer: Joi.string().required().label("Customer ID").messages({
    "any.required": "Customer ID is required",
    "string.base": "Customer ID must be a string",
  }),

  previousReading: Joi.number().min(0).required().messages({
    "number.base": "Previous reading must be a number",
    "number.min": "Previous reading cannot be negative",
  }),

  currentReading: Joi.number()
    .min(Joi.ref("previousReading"))
    .required()
    .messages({
      "number.base": "Current reading must be a number",
      "number.min": "Current reading cannot be less than previous reading",
    }),

  month: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])$/)
    .required()
    .messages({
      "string.pattern.base": "Month must be in MM format (01–12)",
      "any.required": "Month is required",
    }),

  year: Joi.number().integer().min(2000).max(2100).required().messages({
    "number.base": "Year must be a valid number",
    "number.min": "Year must be 2000 or later",
  }),
});

/*
  @desc Validation for updating a usage record
*/
export const updateUsageValidation = Joi.object({
  previousReading: Joi.number().min(0).optional(),
  currentReading: Joi.number()
    .min(Joi.ref("previousReading"))
    .optional()
    .messages({
      "number.min": "Current reading cannot be less than previous reading",
    }),
  month: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])$/)
    .optional()
    .messages({
      "string.pattern.base": "Month must be in MM format (01–12)",
    }),
  year: Joi.number().integer().min(2000).max(2100).optional(),
});
