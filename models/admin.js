import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcrypt";

export const adminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
  },
  { timestamps: true }
);

adminSchema.methods.isValidPassword = async (
  password_supplied,
  user_password
) => {
  const isValid = await bcrypt.compare(password_supplied, user_password);
  return isValid;
};

const Admin = mongoose.model("Admin", adminSchema);

export const validateAdmin = (payload) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .required()
      .min(3)
      .max(50),
    password: Joi.string().min(8).max(50).required(),
  });

  return schema.validate(payload);
};

export default Admin;
