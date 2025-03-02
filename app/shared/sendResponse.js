const sendResponse = (
  res,
  jsonData
) => {
  res.status(jsonData.statusCode).json({
    success: jsonData.success,
    message: jsonData.message,
    data: jsonData.data || null || undefined,
  });
};

module.exports = sendResponse