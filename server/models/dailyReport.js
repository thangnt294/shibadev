import mongoose from "mongoose";
import moment from "moment";

const dailyReportSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: moment().utc().startOf("day"),
  },
  courses: {
    type: Number,
    default: 0,
  },
  users: {
    type: Number,
    default: 0,
  },
  enrollments: {
    type: Number,
    default: 0,
  },
  profit: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("DailyReport", dailyReportSchema);
