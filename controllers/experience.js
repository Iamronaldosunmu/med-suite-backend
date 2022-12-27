import { application } from "express";
import { StatusCodes } from "http-status-codes";
import Applicant, {
  validateDocument,
  validateExperience,
} from "../models/applicant.js";

export const uploadProofOfWork = async (req, res) => {
  let { applicant, applicantId } = req;

  if (!req.body.proofOfWork)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "proofOfWork is required" });

  const { error } = validateDocument(req.body.proofOfWork);
  if (error)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.details[0].message });

  applicant = await Applicant.findById(applicantId);
  applicant.experience.proofOfWork = req.body.proofOfWork;
  await applicant.save();
  console.log(applicant);
  return res
    .status(StatusCodes.OK)
    .json({ message: `proofOfWork document saved successfully` });
};

export const deleteProofOfWork = async (req, res) => {
  let { applicant, applicantId } = req;

  applicant.experience.proofOfWork = {
    secure_url: "",
    public_id: "",
    fileName: "",
  };

  await applicant.save();
  return res
    .status(200)
    .json({ message: "Proof of work deleted successfully!" });
};

export const saveExperience = async (req, res) => {
  let { applicant, applicantId } = req;

  let { error } = validateExperience(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (!req.body.proofOfWork)
    return res.status(400).json({ message: "proofOfWork is required" });

  let { error: documentError } = validateDocument(req.body.proofOfWork);
  if (documentError)
    return res.status(400).json({ message: documentError.details[0].message });

  applicant = await Applicant.findById(applicantId);
  applicant.currentPage = "application_fee";
  applicant.experience = req.body;
  await applicant.save();

  return res.status(200).json({ message: "Experience saved successfully" });
};
