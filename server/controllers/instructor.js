import User from "../models/user";
import Course from "../models/course";

export const becomeInstructor = async (req, res, next) => {
  try {
    const instructor = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { role: "Instructor" },
      },
      {
        new: true,
      }
    ).select("-password");
    res.json(instructor);
  } catch (err) {
    next(err);
  }
};

export const getCurrentInstructor = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id).select("-password");
    if (!user.role.includes("Instructor")) {
      // not an instructor
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    next(err);
  }
};

export const getInstructorCourses = async (req, res, next) => {
  try {
    const { page = 0, limit = 8 } = req.query;
    const courses = await Course.find({
      instructor: req.user._id,
    })
      .sort({ published: 1 })
      .sort({ createdAt: -1 })
      .skip(parseInt(page * limit))
      .limit(parseInt(limit));

    const total = await Course.countDocuments({
      instructor: req.user._id,
    });

    res.json({ courses, total });
  } catch (err) {
    next(err);
  }
};

export const countStudent = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const count = await User.countDocuments({
      enrolled_courses: courseId,
    });
    res.json(count);
  } catch (err) {
    next(err);
  }
};
