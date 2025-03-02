const myModel = require("./auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  jwtExpire,
  jwtSecret,
} = require("../../config");

const addUserIntoDB = async (req) => {
  const { name, email, password } = req;
  try {
    const existingUser = await myModel.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userInfo = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new myModel(userInfo);
    await newUser.save();

    const token = jwt.sign({ email: userInfo.email }, jwtSecret, {
      expiresIn: jwtExpire,
    });

    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req;
  try {
    const user = await myModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ email: email }, jwtSecret, {
      expiresIn: jwtExpire,
    });

    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to login");
  }
};

module.exports = {
  addUserIntoDB,
  loginUser,
};
