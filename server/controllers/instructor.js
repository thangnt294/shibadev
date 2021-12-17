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
    )
      .select("-password")
      .exec();
    res.json(instructor);
  } catch (err) {
    next(err);
  }
};

export const getCurrentInstructor = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
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
    const courses = await Course.find({
      instructor: req.user._id,
    })
      .sort({ createdAt: -1 })
      .exec();

    res.json(courses);
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

export const getInstructorBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    res.json(user.balance);
  } catch (err) {
    next(err);
  }
};
