import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
  {
    chatroom: {
      type: ObjectId,
      required: "Chatroom is required!",
      ref: "Chatroom",
    },
    user: {
      type: ObjectId,
      required: "User is required!",
      ref: "User",
    },
    message: {
      type: String,
      required: "Message is required!",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
