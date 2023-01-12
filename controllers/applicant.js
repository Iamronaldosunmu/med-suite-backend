import Applicant from "../models/applicant.js";
import MessageService from "../services/MessageService.js";

export const getApplicantById = async (req, res) => {
  const { applicant, applicantId } = req;
  return res.status(200).json({ applicant });
};

export const getAllApplicants = async (req, res) => {
  const applicants = await Applicant.find({}).populate("user", "-password");
  return res.status(200).json({ applicants });
};

export const getApplicantNumbers = async (req, res) => {
  const total_applications = await Applicant.find({}).count();
  const being_reviewed = await Applicant.find({
    status: "Being Reviewed",
  }).count();
  const approved_applications = await Applicant.find({
    status: "Approved",
  }).count();

  return res
    .status(200)
    .json({ total_applications, being_reviewed, approved_applications });
};

export const approveApplicant = async (req, res) => {
  const { applicant, applicantId } = req;
  const hasAllDocumentsApproved = Object.values(
    applicant.doumentReviewStatuses._doc
  )
    .filter((status) => typeof status == "string")
    .every((value) => value == "Accepted");

  if (!hasAllDocumentsApproved)
    return res
      .status(400)
      .json({ message: "Not all Documents have been Accepted Yet" });

  applicant.status = "Approved";
  try {
    await MessageService.sendMessage(
      applicantId,
      "admin",
      `Your profile has been approved Successfully! \nWe will communicate the date of your online interview to you in the near future.`
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
  await applicant.save();

  return res.status(200).json({ message: "Applicant Approved Successfully!" });
};
