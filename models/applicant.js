import Joi from "joi";
import mongoose from "mongoose";

const Document = {
  secure_url: String,
  public_id: String,
  fileName: String,
};

const DocumentReviewStatus = {
  type: String,
  enum: ["Being Reviewed", "Accepted", "Rejected"],
};

const DocumentDefault = {
  secure_url: "",
  public_id: "",
  fileName: "",
};

const applicantSchema = mongoose.Schema(
  {
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
        countryOfOrigin: String,
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
        countryOfOrigin: "",
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
        birthCertificate: Document,
        profilePicture: Document,
      },
      default: {
        nursingDegree: DocumentDefault,
        practicingLicense: DocumentDefault,
        photoIdentification: DocumentDefault,
        evidenceOfRegistration: DocumentDefault,
        resume: DocumentDefault,
        referenceLetter: DocumentDefault,
        birthCertificate: DocumentDefault,
        profilePicture: DocumentDefault,
      },
    },
    experience: {
      nursingExperience: { type: String, default: "" },
      postGraduateExperience: { type: String, default: "" },
      proofOfWork: { type: Document, default: DocumentDefault },
    },
    doumentReviewStatuses: {
      type: {
        nursingDegree: DocumentReviewStatus,
        practicingLicense: DocumentReviewStatus,
        photoIdentification: DocumentReviewStatus,
        evidenceOfRegistration: DocumentReviewStatus,
        resume: DocumentReviewStatus,
        referenceLetter: DocumentReviewStatus,
        birthCertificate: DocumentReviewStatus,
        profilePicture: DocumentReviewStatus,
        proofOfWork: DocumentReviewStatus,
      },
      default: {
        nursingDegree: "Being Reviewed",
        practicingLicense: "Being Reviewed",
        photoIdentification: "Being Reviewed",
        evidenceOfRegistration: "Being Reviewed",
        resume: "Being Reviewed",
        referenceLetter: "Being Reviewed",
        birthCertificate: "Being Reviewed",
        profilePicture: "Being Reviewed",
        proofOfWork: "Being Reviewed",
      },
    },
    paymentCompleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "In Progress",
        "Being Reviewed",
        "Approved",
        "Invited For Meeting",
        "Submitted",
      ],
      default: "In Progress",
    },
    currentPage: {
      type: String,
      enum: ["contact_details", "documents", "experience"],
      default: "contact_details",
    },
  },
  { timestamps: true }
);

export const validateContactDetails = (payload) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    middleName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    phoneNumber: Joi.string().min(3).max(50).required(),
    stateOfOrigin: Joi.string().min(3).max(50).required(),
    countryOfOrigin: Joi.string().min(3).max(50).required(),
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
