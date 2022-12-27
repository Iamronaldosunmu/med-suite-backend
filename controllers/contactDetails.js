import { isValidObjectId } from "mongoose";
import Applicant, { validateContactDetails } from "../models/applicant.js";

export const registerContactDetails = async (req, res) => {
  const { applicantId } = req.params;
  if (!isValidObjectId(applicantId))
    return res.status(400).json({ message: "This applicant ID is not valid" });

  const { error } = validateContactDetails(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let applicant = await Applicant.findOne({ _id: applicantId });
  if (!applicant)
    return res.status(404).json({ message: "This applicant does not exist!" });
  console.log(applicant);

  applicant = await Applicant.findOneAndUpdate(
    { _id: applicantId },
    { contactDetails: req.body, currentPage: "documents" },
    { new: true }
  );

  return res
    .status(200)
    .json({ applicant, message: "Contact Details Updated Successfully!" });
};
