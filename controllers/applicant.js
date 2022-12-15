export const getApplicantById = async (req, res) => {
  const { applicant, applicantId } = req;
  return res.status(200).json({ applicant });
};
