import express from "express";
import { getApplicantById } from "../controllers/applicant.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";

const applicantRouter = express.Router();
applicantRouter.get("/:applicantId", validateApplicantId, getApplicantById);

export default applicantRouter;
