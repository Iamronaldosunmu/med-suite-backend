import { isValidObjectId } from "mongoose";
import Applicant from "../models/applicant.js";
import { StatusCodes } from "http-status-codes";

export const validateApplicantId = async (req, res, next) => {
  const { applicantId } = req.params;

  if (!isValidObjectId(applicantId))
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "This applicant ID is not valid" });

  let applicant = await Applicant.findOne({ _id: applicantId }).populate(
    "user"
  );
  if (!applicant)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "This applicant does not exist!" });

  req.applicant = applicant;
  req.applicantId = applicantId;

  next();
};
