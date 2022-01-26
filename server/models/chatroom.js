import mongoose from "mongoose";

const chatroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required!",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatroomSchema);
