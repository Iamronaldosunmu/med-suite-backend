import express from "express";
import { markPaymentCompleted } from "../controllers/payment.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";

const paymentsRouter = express.Router();

paymentsRouter.post("/:applicantId", validateApplicantId, markPaymentCompleted);

export default paymentsRouter;
