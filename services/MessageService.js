import { isValidObjectId } from "mongoose";
import Chat from "../models/chat.js";

class MessageService {
  static async sendMessage(applicantId, from, content) {
    if (!isValidObjectId(applicantId)) throw new Error("This Id is not valid");
    if (from !== "admin" && from !== "applicant")
      throw new Error("The sender is not valid!");
    let message = {
      from,
      content,
      status: { applicant: "unread", admin: "unread" },
    };
    let chat = await Chat.findOne({ applicant: applicantId });
    if (!chat)
      throw new Error("Not Found: No Chat with this applicant ID exists");
    chat.messages.push(message);
    await chat.save();
    return message;
  }

  static async markAllMessagesAsRead(applicantId, userType) {
    if (!isValidObjectId(applicantId)) throw new Error("This Id is not valid");
    if (userType !== "admin" && userType != "applicant")
      throw new Error("This user type is not valid");

    let chat = await Chat.findOne({ applicant: applicantId });
    if (!chat)
      throw new Error("Not Found: No Chat with this applicant ID exists");

    for (let messageIndex in chat.messages) {
      if (
        (userType =
          "admin" && chat.messages[messageIndex].status.admin == "unread")
      ) {
        chat.messages[messageIndex].status.admin = "read";
      }
      if (
        (userType =
          "applicant" &&
          chat.messages[messageIndex].status.applicant == "unread")
      ) {
        chat.messages[messageIndex].status.applicant = "read";
      }
    }
    await chat.save();
  }
}

export default MessageService;
