import Chat from "../models/chat.js";
import MessageService from "../services/MessageService.js";

export const markAllAsRead = async (req, res) => {
  const { applicant, applicantId } = req;
  const { userType } = req.query;

  if (!userType)
    return res.status(400).json({ message: "The user type is required!" });

  if (userType !== "applicant" && userType !== "admin")
    return res.status(400).json({ message: "The user type is invalid!" });

  try {
    console.log(userType);
    if (userType == "applicant")
      await MessageService.markAllMessagesAsRead(applicantId, "applicant");
    else if (userType == "admin") {
      await MessageService.markAllMessagesAsRead(applicantId, "applicant");
    }
    return res
      .status(200)
      .json({ message: "All Messages Successfully marked as read!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllChatboxes = async (req, res) => {
  let chats = await Chat.find({}).populate("applicant");
  chats = chats.filter(chat => chat.applicant.status !== "In Progress");
  return res.status(200).json({ chats });
};

export const sendMessage = async (req, res) => {
  const { applicant, applicantId } = req;
  const { from, content } = req.body;
  if (!content)
    return res.status(400).json({ message: "Message content is required!!" });

  try {
    const message = await MessageService.sendMessage(
      applicantId,
      from,
      content
    );
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMessagesFromOneChatbox = async (req, res) => {
  const { applicant, applicantId } = req;

  const chat = await Chat.findOne({ applicant: applicantId });
  return res.status(200).json({
    messages: chat.messages,
  });
};
