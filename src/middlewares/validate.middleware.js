import AppError from "../utils/appError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const details = error.details.map((err) => err.message);
      return next(new AppError(`Validation error: ${details.join(", ")}`, 400));
    }

    next();
  };
};
