const express = require("express");
const { upload } = require("../../helpers/fileUploader");
const { auth } = require("../../middleware/auth");
const { createFile, createLink, redirectLink, deleteShareLink, updateShareLink, getFiles } = require("./file.controller");

const createFileRouter = express.Router();

createFileRouter.post("/upload", auth(), upload.single("file"), createFile);
createFileRouter.post("/:id/create-link", auth(), createLink);
// createFileRouter.get("/share/:id", redirectLink);
createFileRouter.delete("/:id/delete", auth(), deleteShareLink);
createFileRouter.put("/:id", auth(), updateShareLink);
createFileRouter.get("/", auth(), getFiles);

module.exports = createFileRouter;
