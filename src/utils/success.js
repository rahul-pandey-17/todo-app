const apiResponse = (
  res,
  { statusCode = 200, message = 'Request uccessful', data = null } = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null && { data }),
  });
};

export default apiResponse;
