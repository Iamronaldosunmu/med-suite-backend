import "express-async-errors";
import express from "express";
import connectToDB from "./startup/db.js";
import useRoutesFor from "./startup/routes.js";
import dotenv from "dotenv";
import config from "./startup/config.js";

dotenv.config();
config();
const app = express();
app.use(express.json());
useRoutesFor(app);

app.listen(process.env.PORT || 4000, () =>
  console.log("Console is now running on port 4000")
);
connectToDB();
