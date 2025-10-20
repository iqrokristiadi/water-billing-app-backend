import AppError from "../utils/appError.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[source]; // can be req.body, req.query, or req.params
    const { error } = schema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      const details = error.details.map((err) => err.message).join(", ");
      return next(
        new AppError(`Validation error in ${source}: ${details}`, 400)
      );
    }

    next();
  };
};
