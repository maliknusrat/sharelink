const express = require("express");
const { createUser, userLogin } = require("./auth.controller");

const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/login", userLogin);

module.exports = authRouter;
