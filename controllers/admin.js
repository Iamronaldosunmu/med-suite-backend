import passport from "passport";
import Admin, { validateAdmin } from "../models/admin.js";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Applicant from "../models/applicant.js";
import Chat from "../models/chat.js";
import { sendMail } from "../utils/nodemailertransport.js";
import Joi from "joi";
import Jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

const localStrategy = passportLocal.Strategy;

passport.use(
  "admin login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      // Validate the data sent by the user
      const { error } = validateAdmin(req.body);
      if (error)
        return req.res.status(400).json({ message: error.details[0].message });

      try {
        // Check if the user exists in the database
        const admin = await Admin.findOne({ email });
        if (!admin) {
          return req.res
            .status(400)
            .json({ message: "This Admin does not exist" });
        }

        // Check if the password is correct
        const valid = await admin.isValidPassword(password, admin.password);
        if (!valid) {
          return req.res
            .status(400)
            .json({ message: "Incorrect Username or Password" });
        }

        return done(null, admin, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "admin signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      console.log(req.body);
      // Validate the data sent by the user
      const { error } = validateAdmin(req.body);
      console.log(error);
      if (error)
        return req.res.status(400).json({ message: error.details[0].message });

      // Check if the email exists in the database
      const admin = await Admin.findOne({ email });
      if (admin)
        return req.res.status(400).json({
          message: "This admin already exists",
        });

      // Hash the password
      const saltRounds = 10;
      const hashed_password = await bcrypt.hash(password, saltRounds);

      // Store the new user in the database
      try {
        const admin = await Admin.create({
          email,
          password: hashed_password,
        });

        return done(null, { ...admin });
      } catch (error) {
        done(error);
      }
    }
  )
);

export const createNewAdmin = async (req, res) => {
  const { password, ...admin } = req.user._doc;
  const token = jwt.sign({ ...admin }, process.env.JWT_SECRET);
  console.log({ ...admin });
  return res
    .status(201)
    .json({ message: "New Admin Created Successfully", admin, token });
};

export const logAdminIn = async (req, res) => {
  const { password, ...admin } = req.user._doc;
  console.log({ ...admin });
  const token = jwt.sign({ ...admin }, process.env.JWT_SECRET);
  return res.status(200).json({ message: "Admin Logged In!", token });
};
