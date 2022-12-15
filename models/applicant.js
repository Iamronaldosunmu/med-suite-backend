import Joi from "joi";
import mongoose from "mongoose";

const Document = {
  secure_url: String,
  public_id: String,
  fileName: String,
};

const DocumentDefault = {
  secure_url: "",
  public_id: "",
  fileName: "",
};

const applicantSchema = mongoose.Schema({
  // Relationship between User and Applicant
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  contactDetails: {
    type: {
      firstName: String,
      middleName: String,
      lastName: String,
      phoneNumber: String,
      stateOfOrigin: String,
      localGovernmentArea: String,
      street: String,
      city: String,
      state: String,
    },
    default: {
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      stateOfOrigin: "",
      localGovernmentArea: "",
      street: "",
      city: "",
      state: "",
    },
  },
  documents: {
    type: {
      nursingDegree: Document,
      practicingLicense: Document,
      photoIdentification: Document,
      evidenceOfRegistration: Document,
      resume: Document,
      referenceLetter: Document,
      letterOfGoodStanding: Document,
    },
    default: {
      nursingDegree: DocumentDefault,
      practicingLicense: DocumentDefault,
      photoIdentification: DocumentDefault,
      evidenceOfRegistration: DocumentDefault,
      resume: DocumentDefault,
      referenceLetter: DocumentDefault,
      letterOfGoodStanding: DocumentDefault,
    },
  },
  experience: {
    nursingExperience: { type: String, default: "" },
    postGraduateExperience: { type: String, default: "" },
    proofOfWork: { type: Document, default: DocumentDefault },
  },
  paymentCompleted: {
    type: Boolean,
    default: false,
  },
});

export const validateContactDetails = (payload) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    middleName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    phoneNumber: Joi.string().min(3).max(50).required(),
    stateOfOrigin: Joi.string().min(3).max(50).required(),
    localGovernmentArea: Joi.string().min(3).max(50).required(),
    street: Joi.string().min(3).max(50).required(),
    city: Joi.string().min(3).max(50).required(),
    state: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(payload);
};

export const validateDocument = (payload) => {
  const schema = Joi.object({
    secure_url: Joi.string().required(),
    public_id: Joi.string().required(),
    fileName: Joi.string().required(),
  });
  return schema.validate(payload);
};

export const validateExperience = (payload) => {
  const schema = Joi.object({
    nursingExperience: Joi.string().min(3).max(50).required(),
    postGraduateExperience: Joi.string().min(3).max(50).required(),
    proofOfWork: Joi.required(),
  });
  return schema.validate(payload);
};

const Applicant = mongoose.model("Applicant", applicantSchema);
export default Applicant;
