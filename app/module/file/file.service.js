const mongoose = require("mongoose");
const crypto = require("crypto");
const { uploadToCloudinary } = require("../../helpers/fileUploader");
const userModel = require("../auth/auth.model");
const { File, Link } = require("../file/file.model");
const { backendUrl, jwtSecret } = require("../../config");
const jwt = require("jsonwebtoken");

const createFileServices = async (req) => {
  const userInfo = await userModel.findOne({ email: req.user });
  if (!userInfo) {
    throw new Error("user not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const file = req.file;
    const data = req.body;

    if (!file) {
      throw new Error("Please added a file");
    }

    if (file) {
      const uploadFile = await uploadToCloudinary(file);
      data.file = uploadFile?.secure_url;
      let fileName = uploadFile?.original_filename;
      const fileSize = uploadFile?.bytes;
      data.size = fileSize;
      if (uploadFile?.resource_type === "raw") {
        data.type = "note";
        fileName = fileName + ".docx";
      } else if (uploadFile?.format === "pdf") {
        data.type = "pdf";
        fileName = fileName + ".pdf";
      } else {
        data.type = "image";
        fileName = fileName + "." + uploadFile?.format;
      }
      data.name = fileName;
    }

    if (data.data) {
      let folder = JSON.parse(data.data)?.folder;
      data.folder = folder;
    }

    data.email = req.user;
    const result = await File.create([data], { session });

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new Error(`File creation failed: ${error.message}`);
  }
};

const getUrl = async (id, email, payload) => {
  try {
    const { type, expire } = payload;

    const userInfo = await userModel.findOne({ email: email });
    if (!userInfo) {
      throw new Error("user not found");
    }

    const fileInfo = await File.findOne({ _id: id });
    if (!fileInfo) {
      throw new Error("File not found");
    }

    const uniqueShareId = crypto.randomUUID().slice(0, 6);

    const newLinkData = {
      userEmail: email,
      shareId: uniqueShareId,
      redirectUrl: fileInfo.file,
      isPublic: type == "public" ? true : false,
    };

    if (type === "private") {
      if (!expire) {
        throw new Error("Expiration time required for private links");
      }

      const token = jwt.sign(
        { email: email, exp: Math.floor(Date.now() / 1000) + expire },
        jwtSecret
      );
      newLinkData.token = token;
    }

    const newLink = new Link(newLinkData);

    await newLink.save();

    let shareableUrl = `${backendUrl}/file/share/${uniqueShareId}`;

    return shareableUrl;
  } catch (err) {
    console.log(err.message);
  }
};

const getOriginalFile = async (shareId, authorizationToken) => {
  try {
    const link = await Link.findOne({ shareId: shareId });

    if (!link) {
      throw new Error("File not found or link does not exist");
    }

    if (link.isPublic) {
      await Link.updateOne({ shareId }, { $inc: { views: 1 } });
      return link.redirectUrl;
    }

    if (!authorizationToken) {
      throw new Error("You are not Authorized");
    }

    const decodedToken = jwt.decode(link.token);

    const decoded = jwt.verify(authorizationToken, jwtSecret);

    if (decoded.email !== link.userEmail) {
      throw new Error("Unauthorized access: Token does not match owner");
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > decodedToken.exp) {
      throw new Error("Token expired");
    }

    await Link.updateOne({ shareId }, { $inc: { views: 1 } });

    return link.redirectUrl;
  } catch (err) {
    console.error("Error:", err.message);
    return null; 
  }
};

const deleteLink = async (shareId,email) => {
  const link = await Link.findOne({ shareId });

  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }

  if (link.userEmail !== email) {
    throw new Error('User not identified')
  }

  const result = await Link.deleteOne({ shareId });

  return result;
}

const updateLink = async (payload, email, shareId) => {
  const { type, expire } = payload;
  
  const link = await Link.findOne({ shareId });

  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }

  if (link.userEmail !== email) {
    throw new Error("Unauthorized: You do not own this link")
  }

  let updatedFields = { isPublic: type == "public" ? true : false };

  if (type=='private') {
    const token = jwt.sign(
      { email: email, exp: Math.floor(Date.now() / 1000) + expire },
      jwtSecret
    );
    updatedFields.token = token;
  } else {
    updatedFields.token = null; 
  }

  await Link.updateOne({ shareId }, { $set: updatedFields });

  return await Link.findOne({ shareId });
}

const getAllFiles = async (email) => {
  const result = await File.find({ email }).exec();
  return result;
}

module.exports = {
  createFileServices,
  getUrl,
  getOriginalFile,
  deleteLink,
  updateLink,
  getAllFiles
};
