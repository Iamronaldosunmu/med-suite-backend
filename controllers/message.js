import Chat from "../models/chat.js";
import MessageService from "../services/MessageService.js";

export const markAllAsRead = async (req, res) => {
  const { applicant, applicantId } = req;

  try {
    await MessageService.markAllMessagesAsRead(applicantId);
    return res
      .status(200)
      .json({ message: "All Messages Successfully marked as read!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllChatboxes = async (req, res) => {
  const chats = await Chat.find({});
  return res.status(200).json({ chats });
};

export const sendMessage = async (req, res) => {
  const { applicant, applicantId } = req;
  const { from, content } = req.body;
  if (!content)
    return res.status(400).json({ message: "Message content is required!!" });

  try {
    await MessageService.sendMessage(applicantId, from, content);
    return res.status(200).json({ message: "Message sent Successfully!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMessagesFromOneChatbox = async (req, res) => {
  const { applicant, applicantId } = req;

  const chat = await Chat.findOne({ applicant: applicantId });
  console.log(chat.mes);
  return res.status(200).json({
    messages: chat.messages,
  });
};
