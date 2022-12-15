import express from "express";
import {
  deleteProofOfWork,
  saveExperience,
  uploadProofOfWork,
} from "../controllers/experience.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";

const experienceRouter = express.Router();

experienceRouter.patch(
  "/:applicantId/proofOfWork",
  validateApplicantId,
  uploadProofOfWork
);
experienceRouter.delete(
  "/:applicantId/proofOfWork",
  validateApplicantId,
  deleteProofOfWork
);
experienceRouter.post("/:applicantId", validateApplicantId, saveExperience);

export default experienceRouter;
