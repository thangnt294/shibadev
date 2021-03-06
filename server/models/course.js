import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
      minlength: 200,
    },
    video: {},
    preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 100,
      required: true,
    },
    content: {
      type: String,
      minlength: 20,
      amxLength: 500,
      required: true,
    },
    commenter: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 100,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      minlength: 20,
      maxlength: 1000,
      required: true,
    },
    price: {
      type: Number,
      default: 9.99,
    },
    image: {},
    tags: [],
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true,
    },
    enrollments: {
      type: Number,
      default: 0,
    },
    lessons: [lessonSchema],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
