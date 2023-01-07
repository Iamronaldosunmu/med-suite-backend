export const approveDocument = async (req, res) => {
  const { applicantId, applicant } = req;

  const { fieldName } = req.body;
  let validFieldNames = Object.keys(applicant.doumentReviewStatuses._doc);
  validFieldNames = validFieldNames.filter((field) => field != "_id");
  console.log(validFieldNames);

  if (!fieldName)
    return res.status(400).json({ message: "The fieldName is required!" });
  if (!validFieldNames.includes(fieldName))
    return res.status(400).json({ message: "This fieldName is not valid!" });

  applicant.doumentReviewStatuses[fieldName] = "Accepted";
  await applicant.save();

  return res.status(200).json({message: `${fieldName} document approved successfully`})
};


export const rejectDocument = async (req, res) => {
  const { applicantId, applicant } = req;

  const { fieldName } = req.body;
  let validFieldNames = Object.keys(applicant.doumentReviewStatuses._doc);
  validFieldNames = validFieldNames.filter((field) => field != "_id");
  console.log(validFieldNames);

  if (!fieldName)
    return res.status(400).json({ message: "The fieldName is required!" });
  if (!validFieldNames.includes(fieldName))
    return res.status(400).json({ message: "This fieldName is not valid!" });

  applicant.doumentReviewStatuses[fieldName] = "Rejected";
  await applicant.save();

  return res.status(200).json({message: `${fieldName} document rejected successfully`})
};
