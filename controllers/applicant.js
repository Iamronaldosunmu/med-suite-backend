import MessageService from "../services/MessageService.js";

export const getApplicantById = async (req, res) => {
  const { applicant, applicantId } = req;
  return res.status(200).json({ applicant });
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
