import express from "express";
import {
  approveApplicant,
  getAllApplicants,
  getApplicantById,
  getApplicantNumbers,
} from "../controllers/applicant.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";

const applicantRouter = express.Router();
applicantRouter.get("/", getAllApplicants);
applicantRouter.get("/numbers", getApplicantNumbers);
applicantRouter.get("/:applicantId", validateApplicantId, getApplicantById);
applicantRouter.post(
  "/approve_applicant/:applicantId",
  validateApplicantId,
  approveApplicant
);
export default applicantRouter;
