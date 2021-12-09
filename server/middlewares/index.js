import expressJwt from "express-jwt";
import Course from "../models/course";
import User from "../models/user";

export const requireSignin = expressJwt({
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const isInstructor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

export const isEnrolled = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const course = await Course.findOne({ slug: req.params.slug }).exec();

    // check if course id is found in user enrolled_courses array
    const isEnrolled = user.enrolled_courses.some(
      (enrolledCourse) => enrolledCourse.toString() === course._id.toString()
    );

    if (isEnrolled) {
      next();
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    console.log(err);
  }
};
