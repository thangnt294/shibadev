import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      maxlength: 500,
      required: true,
    },
  },
  { timestamps: true }
);

const chatroomSchema = new mongoose.Schema(
  {
    users: {
      type: [ObjectId],
      required: true,
      ref: "User",
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatroomSchema);
