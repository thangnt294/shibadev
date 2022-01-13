import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    course: {
      type: ObjectId,
      ref: "Course",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
