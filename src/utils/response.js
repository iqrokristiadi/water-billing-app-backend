/**
 * Unified success and error response helpers
 * Keeps API responses consistent for frontend consumption.
 */

const successResponse = (
  res,
  message = "Success",
  data = null,
  statusCode = 200,
  meta = null
) => {
  const response = {
    status: "success",
    message,
  };

  if (data !== null) response.data = data;
  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

const createdResponse = (
  res,
  message = "Resource created successfully",
  data = null
) => {
  return successResponse(res, message, data, 201);
};

const noContentResponse = (res, message = "No content") => {
  return res.status(204).json({
    status: "success",
    message,
  });
};

const failResponse = (res, message = "Request failed", statusCode = 400) => {
  return res.status(statusCode).json({
    status: "fail",
    message,
  });
};

export { successResponse, createdResponse, noContentResponse, failResponse };
