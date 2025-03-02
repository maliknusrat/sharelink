const mongoose = require("mongoose");

const FileCreateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// module.exports = mongoose.model("files", FileCreateSchema);

const linkSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  shareId: { type: String, required: true, unique: true },
  redirectUrl: { type: String, required: true },
  isPublic: { type: Boolean, required: true },
  token: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// module.exports = mongoose.model("Link", linkSchema);

const File = mongoose.model("files", FileCreateSchema);
const Link = mongoose.model("links", linkSchema);

module.exports = { File, Link };