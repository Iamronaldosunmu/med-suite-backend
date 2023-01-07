import express from "express";
import {
  approveApplicant,
  getApplicantById,
} from "../controllers/applicant.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";

const applicantRouter = express.Router();
applicantRouter.get("/:applicantId", validateApplicantId, getApplicantById);
applicantRouter.post(
  "/approve_applicant/:applicantId",
  validateApplicantId,
  approveApplicant
);

export default applicantRouter;
