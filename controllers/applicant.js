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
      .json({ message: "Not all Documents have been Accepted Yet" }); 4
  
  applicant.status = "Approved"
  await applicant.save();

  return res.status(200).json({message: "Applicant Approved Successfully!"})
};
