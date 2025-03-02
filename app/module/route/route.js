const express = require("express");
const authRouter = require("../auth/auth.route");
const createFileRouter = require("../file/file.route");

const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/file",
    route: createFileRouter,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

module.exports = router;
