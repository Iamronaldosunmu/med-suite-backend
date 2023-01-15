import express from "express";
import passport from "passport";
import {
  createNewUser,
  sendPasswordReset,
  logUserIn,
  handlePasswordReset,
} from "../controllers/user.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";

const userRouter = express.Router();

userRouter.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  createNewUser
);

userRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  logUserIn
);

userRouter.post("/password_reset", sendPasswordReset);
userRouter.post("/password_reset/:userId", handlePasswordReset);

export default userRouter;
