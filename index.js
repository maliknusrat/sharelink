const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./app/module/route/route");

dotenv.config();
const port = process.env.port || 5000;

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://spontaneous-dieffenbachia-537345.netlify.app",
    credentials: true
  })
);

let { DB_USER, DB_PASS } = process.env;
let url = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.nhg2oh1.mongodb.net/Files?retryWrites=true&w=majority&appName=Cluster0`;

const database = "Files";
mongoose
  .connect(url, { dbName: database })
  .then(() => {
    console.log("Connected to database!");
})
  .catch((error) => {
    console.log("Connection failed!", error);
    process.exit();
});

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Project is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});