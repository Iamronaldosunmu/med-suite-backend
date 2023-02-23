import express from "express";
import passport from "passport";
import { createNewAdmin, logAdminIn } from "../controllers/admin.js";

const adminRouter = express.Router();

adminRouter.post(
  "/login",
  passport.authenticate("admin login", { session: false }),
  logAdminIn
);

adminRouter.post(
  "/signup",
  passport.authenticate("admin signup", { session: false }),
  createNewAdmin
);

export default adminRouter;
