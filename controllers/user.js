import passport from "passport";
import User, { validateUser } from "../models/user.js";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Applicant from "../models/applicant.js";

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
