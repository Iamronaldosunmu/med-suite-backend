import Chat from "../models/chat";

class MessageService {
  static async sendMessage(applicantId, from, content) {
    const message = { from, content, status: "unread" };
    const chat = await Chat.findOne({ applicant: applicantId });
    if (!chat)
      throw new Error("Not Found: No Chat with this applicant ID exists");
    chat.messages.push(message);
    await chat.save();
  }
}

export default MessageService;
