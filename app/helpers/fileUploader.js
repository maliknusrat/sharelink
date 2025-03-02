const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const config = require("../config/index");

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const uploadToCloudinary = async (
  file
) => {
  return new Promise((resolve, reject) => {
    const isImage = file.mimetype.startsWith("image/");
    const isPDF = file.mimetype === "application/pdf";

    cloudinary.uploader.upload(
      file?.path,
      {
        resource_type: isImage ? "image" : isPDF ? "image" : "raw",
      },
      (error, result) => {
        fs.unlinkSync(file?.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const upload = multer({ storage: storage });

module.exports = {
  upload,
  uploadToCloudinary,
};