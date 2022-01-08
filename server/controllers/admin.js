import User from "../models/user";
import Course from "../models/course";
import DailyReport from "../models/dailyReport";
import moment from "moment";
import {
  removeImageFromS3,
  removeVideoFromS3,
  isEmpty,
} from "../utils/helpers";

export const getCurrentAdmin = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
    if (!user.role.includes("Admin")) {
      // not an admin
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    next(err);
  }
};

export const getDailyReport = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;
    const reports = await DailyReport.find({
      date: {
        $gte: moment.utc(fromDate),
        $lt: moment.utc(toDate).add(1, "s"),
      },
    }).sort({ date: 1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    const { page = 0, limit = 12, term = ".*" } = req.query;
    const courses = await Course.find({
      $or: [{ name: new RegExp(term) }, { tags: new RegExp(term) }],
    })
      .sort({ published: -1, name: 1, updatedAt: -1 })
      .skip(parseInt(page * limit))
      .limit(parseInt(limit))
      .populate("instructor", "_id name");

    const total = await Course.countDocuments({
      $or: [{ name: new RegExp(term) }, { tags: new RegExp(term) }],
    });

    res.json({ courses, total });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    // remove course image
    if (!isEmpty(course.image)) {
      await removeImageFromS3(course.image);
    }

    // remove all videos belonging to the course
    const removeVideos = [];

    course.lessons.forEach((lesson) => {
      if (!isEmpty(lesson.video)) {
        removeVideos.push(removeVideoFromS3(lesson.video));
      }
    });

    await Promise.all(removeVideos);

    // remove course from enroll_courses of user
    await User.updateMany(
      {
        enroll_courses: courseId,
      },
      {
        $pull: {
          enroll_courses: courseId,
        },
      }
    );
    // delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
