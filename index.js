import "express-async-errors";
import express from "express";
import connectToDB from "./startup/db.js";
import useRoutesFor from "./startup/routes.js";
import dotenv from "dotenv";
import config from "./startup/config.js";
import middleware from "./startup/middleware.js";

dotenv.config();
config();
const app = express();
app.use(express.json());
middleware(app);
useRoutesFor(app);

app.listen(process.env.PORT || 4000, () =>
  console.log(`Console is now running on port ${process.env.PORT}`)
);
connectToDB();
