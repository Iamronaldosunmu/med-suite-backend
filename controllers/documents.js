import StatusCodes from "http-status-codes";
import Applicant, { validateDocument } from "../models/applicant.js";

export const saveDocument = async (req, res) => {
  let { applicant, applicantId } = req;
  const fieldName = Object.keys(req.body)[0];
  let validFieldNames = Object.keys(applicant.documents._doc);
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

  applicant = await Applicant.findById(applicantId);
  applicant.documents[fieldName] = req.body[fieldName];
  console.log(applicant);
  await applicant.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: `${fieldName} document saved successfully` });
};

export const deleteDocument = async (req, res) => {
  let { applicant, applicantId } = req;
  const { fieldName } = req.query;
  let validFieldNames = Object.keys(applicant.documents._doc);
  validFieldNames = validFieldNames.filter((field) => field != "_id");

  if (!fieldName)
    return res.status(400).json({
      message: "Please specify the field name in the query of the request",
    });
  if (!validFieldNames.includes(fieldName))
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `${fieldName} is not a valid field` });

  applicant.documents[fieldName] = {
    secure_url: "",
    public_id: "",
    fileName: "",
  };

  await applicant.save();
  return res
    .status(200)
    .json({ message: `${fieldName} has been deleted successfully` });
};

export const checkIfAllDocumentsHaveBeenUploaded = async (req, res) => {
  let { applicant } = req;

  const fileHasBeenUploaded = (object) => {
    return Boolean(object.secure_url && object.public_id && object.fileName);
  };

  let fields = Object.keys(applicant.documents._doc);
  fields = fields.filter((field) => field != "_id");

  const allFilesHaveBeenUploaded = fields.every((field) =>
    fileHasBeenUploaded(applicant.documents._doc[field])
  );

  if (allFilesHaveBeenUploaded) {
    applicant.currentPage = "experience";
    await applicant.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "All Documents have been uploaded successfully" });
  } else
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Not all files have been uploaded yet!" });
};
