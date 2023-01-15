import passport from "passport";
import User, { validateUser } from "../models/user.js";
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
// const JWTstrategy = passportJwt.Strategy;
// const ExtractJWT = passportJwt.ExtractJwt;

// Passport function to handle the signup process
passport.use(
  "signup",
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
      const { error } = validateUser(req.body);
      console.log(error);
      if (error)
        return req.res.status(400).json({ message: error.details[0].message });

      // Check if the email exists in the database
      const user = await User.findOne({ email });
      if (user)
        return req.res.status(400).json({
          message: "An account with this email already exists, Please Log in",
        });

      // Hash the password
      const saltRounds = 10;
      const hashed_password = await bcrypt.hash(password, saltRounds);

      // Store the new user in the database
      try {
        const user = await User.create({
          email,
          password: hashed_password,
        });

        const applicant = await Applicant.create({ user: user._id });
        const chat = await Chat.create({ applicant: applicant._id });
        return done(null, { ...user, applicantId: applicant._id });
      } catch (error) {
        done(error);
      }
    }
  )
);

// Passport function to handle the login process
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      // Validate the data sent by the user
      const { error } = validateUser(req.body);
      if (error)
        return req.res.status(400).json({ message: error.details[0].message });

      try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
          return req.res
            .status(400)
            .json({ message: "This user does not exist, Please Sign Up" });
        }

        // Check if the password is correct
        const valid = await user.isValidPassword(password, user.password);
        if (!valid) {
          return req.res
            .status(400)
            .json({ message: "Incorrect Username or Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// This is the controller for signing a user up
export const createNewUser = async (req, res) => {
  const { applicantId } = req.user;
  const { password, ...user } = req.user._doc;
  const token = jwt.sign({ ...user, applicantId }, process.env.JWT_SECRET);
  console.log({ ...user, applicantId });
  return res
    .status(201)
    .json({ message: "Sign up Successful!", user: user, token, applicantId });
};

export const logUserIn = async (req, res) => {
  const { password, ...user } = req.user._doc;
  const applicant = await Applicant.findOne({ user: user._id });
  console.log({ ...user, applicantId: applicant._id });
  const token = jwt.sign(
    { ...user, applicantId: applicant._id },
    process.env.JWT_SECRET
  );
  return res.status(200).json({ message: "Log In Successful!", token });
};

export const sendPasswordReset = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .required()
      .min(3)
      .max(50),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: "This user does not exist!" });

  const secret = process.env.JWT_SECRET;

  const token = Jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret,
    { expiresIn: "15m" }
  );

  const message = `<a href="${process.env.FRONTEND_HOST}/reset_password/${token}">Click on this link to reset your password</a>`;
  console.log(message);
  try {
    sendMail(user.email, "Password Reset", message, (err, info) => {
      if (err) throw new Error("Could not send email");
      else {
        return res.status(200).json({
          message:
            "Email Sent! Please Check your Email for the Link to Reset your Password",
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong on the server!" });
  }
};

export const handlePasswordReset = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId))
    return res.status(400).json({ message: "This user ID is not valid" });

  const schema = Joi.object({
    password: Joi.string().required().min(3).max(50),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const password = req.body.password;
  // Hash the password
  const saltRounds = 10;
  const hashed_password = await bcrypt.hash(password, saltRounds);

  const user = await User.findById(userId);
  user.password = hashed_password;
  await user.save();

  return res.status(200).json({ message: "Password Changed successfully!" });
};
