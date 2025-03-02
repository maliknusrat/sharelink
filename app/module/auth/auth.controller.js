const catchAsync = require("../../shared/catchAsync");
const sendResponse = require("../../shared/sendResponse");
const { addUserIntoDB, loginUser, forgetPasswordServices, checkOtp, resendEmail, resetPassword } = require("./auth.service");

const createUser = catchAsync(async (req, res) => {
  const result = await addUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Create User Successfully`,
    data: result,
  });
});

const userLogin = catchAsync(async (req, res) => {
  const result = await loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Login Successfully`,
    data: result,
  });
});

module.exports = {
  createUser,
  userLogin
};