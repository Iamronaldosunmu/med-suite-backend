import MessageService from "../services/MessageService.js";
import StatusCodes from "http-status-codes";
import { validateDocument } from "../models/applicant.js";

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

  return res
    .status(200)
    .json({ message: `${fieldName} document approved successfully` });
};

export const rejectDocument = async (req, res) => {
  const { applicantId, applicant } = req;

  const { fieldName, message } = req.body;
  if (!message)
    return res.status(400).json({
      message:
        "A message that will be sent to the applicant must be specified!",
    });

  let validFieldNames = Object.keys(applicant.doumentReviewStatuses._doc);
  validFieldNames = validFieldNames.filter((field) => field != "_id");
  console.log(validFieldNames);

  if (!fieldName)
    return res.status(400).json({ message: "The fieldName is required!" });
  if (!validFieldNames.includes(fieldName))
    return res.status(400).json({ message: "This fieldName is not valid!" });

  applicant.doumentReviewStatuses[fieldName] = "Rejected";
  await applicant.save();

  try {
    await MessageService.sendMessage(
      applicantId,
      "admin",
      `The following document was rejected: ${fieldName}`
    );
    await MessageService.sendMessage(applicantId, "admin", message);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  return res
    .status(200)
    .json({ message: `${fieldName} document rejected successfully` });
};

export const reuploadDocument = async (req, res) => {
  let { applicant, applicantId } = req;
  const fieldName = Object.keys(req.body)[0];
  let validFieldNames = [
    ...Object.keys(applicant.documents._doc),
    "proofOfWork",
  ];
  validFieldNames = validFieldNames.filter((field) => field != "_id");
  if (!validFieldNames.includes(fieldName))
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `${fieldName} is not a valid field` });

  const { error } = validateDocument(req.body[fieldName]);
  if (error)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.details[0].message });

  if (fieldName !== "proofOfWork") {
    applicant.documents[fieldName] = req.body[fieldName];
  } else {
    applicant.experience.proofOfWork = req.body["proofOfWork"];
  }
  console.log(applicant.doumentReviewStatuses[fieldName]);

  applicant.doumentReviewStatuses[fieldName] = "Being Reviewed";
  await applicant.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: `${fieldName} document re-uploaded Successfully` });
};
