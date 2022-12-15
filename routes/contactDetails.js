import express from "express";
import { registerContactDetails } from "../controllers/contactDetails.js";

const contactDetailsRouter = express.Router();

contactDetailsRouter.post("/:applicantId", registerContactDetails);

export default contactDetailsRouter;
