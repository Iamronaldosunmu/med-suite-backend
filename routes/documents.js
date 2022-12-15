import express from "express";
import {
  checkIfAllDocumentsHaveBeenUploaded,
  deleteDocument,
  saveDocument,
} from "../controllers/documents.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";

const documentsRouter = express.Router();
documentsRouter.patch("/:applicantId", validateApplicantId, saveDocument);
documentsRouter.delete("/:applicantId", validateApplicantId, deleteDocument);
documentsRouter.post(
  "/:applicantId",
  validateApplicantId,
  checkIfAllDocumentsHaveBeenUploaded
);

export default documentsRouter;
