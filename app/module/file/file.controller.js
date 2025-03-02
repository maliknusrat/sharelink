const catchAsync = require("../../shared/catchAsync");
const sendResponse = require("../../shared/sendResponse");
const { createFileServices, getUrl, getOriginalFile, deleteLink, updateLink, getAllFiles } = require("./file.service");

const createFile = catchAsync(async (req, res) => {
  const result = await createFileServices(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `File Upload Successfully`,
    data: result,
  });
});

const createLink = catchAsync(async (req, res) => {
  const id = req.params.id;
  const email = req.user;
  const result = await getUrl(id, email, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Url Created Successfully`,
    data: result,
  });
});

const redirectLink = catchAsync(async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  const result = await getOriginalFile(id, token);
  res.redirect(result);
});

const deleteShareLink = catchAsync(async (req, res) => {
  const id = req.params.id;
  const email = req.user;
  const result = await deleteLink(id, email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Url Deleted Successfully`,
    data: result,
  });
});

const updateShareLink = catchAsync(async (req, res) => {
  const id = req.params.id;
  const email = req.user;
  const result = await updateLink(req.body, email, id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Link Update Successfully`,
    data: result,
  });
});

const getFiles = catchAsync(async (req, res) => {
  const result = await getAllFiles(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Files Retrieve Successfully`,
    data: result,
  });
});

module.exports = {
  createFile,
  createLink,
  redirectLink,
  deleteShareLink,
  updateShareLink,
  getFiles
};