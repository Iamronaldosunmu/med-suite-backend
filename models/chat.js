import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    from: {
      type: String,
      enum: ["admin", "applicant"],
      required: true,
    },
    content: {
      type: String,
    },
    status: {
      type: {
        applicant: String,
        admin: String,
      },
      default: {
        applicant: "unread",
        admin: "unread",
      },
    },
  },
  { timestamps: true }
);

const chatSchema = mongoose.Schema(
  {
    applicant: { type: mongoose.Types.ObjectId, ref: "Applicant" },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
