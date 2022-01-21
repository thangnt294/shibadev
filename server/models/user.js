import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    avatar: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
    },
    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Instructor", "Admin"],
    },
    enrolled_courses: [{ type: ObjectId, ref: "Course" }],
    wish_list: [{ type: ObjectId, ref: "Course" }],
    balance: {
      type: Number,
      default: 0,
    },
    passwordResetCode: {
      data: String,
      default: "",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
