import express from "express";
import {
  getAllChatboxes,
  getMessagesFromOneChatbox,
  markAllAsRead,
  sendMessage,
} from "../controllers/message.js";
import { validateApplicantId } from "../middleware/ValidateApplicantId.js";

const messageRouter = express.Router();

messageRouter.post(
  "/markAllAsRead/:applicantId",
  validateApplicantId,
  markAllAsRead
);

messageRouter.get(
  "/:applicantId",
  validateApplicantId,
  getMessagesFromOneChatbox
);

messageRouter.get("/", getAllChatboxes);

messageRouter.post(
  "/send_message/:applicantId",
  validateApplicantId,
  sendMessage
);

export default messageRouter;
