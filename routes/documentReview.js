import express from "express";
import {
  approveDocument,
  rejectDocument,
} from "../controllers/documentReview.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";
import { isValidObjectId } from "../utils/validateObjectId.js";

const documentReviewRouter = express.Router();

documentReviewRouter.post(
  "/approve/:applicantId",
  validateApplicantId,
  approveDocument
);
documentReviewRouter.post(
  "/reject/:applicantId",
  validateApplicantId,
  rejectDocument
);

export default documentReviewRouter;
