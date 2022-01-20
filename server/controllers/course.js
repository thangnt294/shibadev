import Course from "../models/course";
import slugify from "slugify";
import User from "../models/user";
import CompletedLesson from "../models/completedLesson";
import DailyReport from "../models/dailyReport";
import Rating from "../models/rating";
import { tags } from "../constants";
import {
  isEmpty,
  uploadImageToS3,
  removeImageFromS3,
  uploadVideoToS3,
  removeVideoFromS3,
} from "../utils/helpers";
import moment from "moment";

export const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (name.length < 6 || name.length > 100) {
      return res.status(400).send("Name must be between 6 and 100 characters");
    }

    if (description.length < 20 || description.length > 1000) {
      return res
        .status(400)
        .send("Description must be between 20 and 1000 characters");
    }

    const courseExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });

    if (courseExist) return res.status(400).send("Title is taken");

    let newCourse = {
      slug: slugify(req.body.name),
      instructor: req.user._id,
      ...req.body,
    };

    // upload image to S3
    const { uploadImage } = req.body;

    if (!isEmpty(uploadImage)) {
      const data = await uploadImageToS3(uploadImage, req.user.email);
      newCourse.image = data;
    }
    delete newCourse.uploadImage;
    const course = await new Course(newCourse).save();

    await DailyReport.updateOne(
      { date: moment().utc().startOf("day") },
      { $inc: { courses: 1 } },
      { upsert: true, setDefaultOnInsert: true }
    );
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (name.length < 6 || name.length > 100) {
      return res.status(400).send("Name must be between 6 and 100 characters");
    }

    if (description.length < 20 || description.length > 1000) {
      return res
        .status(400)
        .send("Description must be between 20 and 1000 characters");
    }

    const { slug } = req.params;

    const course = await Course.findOne({ slug });
    if (req.user._id !== course.instructor.toString()) {
      return res.status(400).send("Unauthorized");
    }

    if (course.published) {
      return res.status(403).send("Cannot edit published course");
    }

    const { removedImage, uploadImage } = req.body;
    const updatedCourse = req.body;

    if (!isEmpty(uploadImage)) {
      if (!isEmpty(removedImage)) {
        const { image } = req.body;

        await removeImageFromS3(image);
      }

      const data = await uploadImageToS3(uploadImage, req.user.email);
      updatedCourse.image = data;
    } else {
      if (!isEmpty(removedImage)) {
        const { image } = req.body;

        await removeImageFromS3(image);
        updatedCourse.image = null;
      }
    }
    delete updatedCourse.uploadImage;
    delete updatedCourse.removedImage;

    const updated = await Course.findOneAndUpdate({ slug }, updatedCourse, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .populate("comments.commenter", "_id name avatar");
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const uploadVideo = async (req, res, next) => {
  try {
    if (req.user._id !== req.params.instructorId) {
      return res.status(400).send("Unauthorized");
    }
    const { video } = req.files;
    if (isEmpty(video)) {
      return res.status(400).send("No video");
    }

    // video params
    const data = await uploadVideoToS3(video, req.user.email);
    res.send(data);
  } catch (err) {
    next(err);
  }
};

export const removeVideo = async (req, res, next) => {
  try {
    if (req.user._id !== req.params.instructorId) {
      return res.status(400).send("Unauthorized");
    }

    await removeVideoFromS3(req.body);
    res.send({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const addLesson = async (req, res, next) => {
  try {
    const { slug, instructorId } = req.params;
    const { title, content, video } = req.body;
    if (req.user._id !== instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },
      { new: true }
    ).populate("instructor", "_id name");

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const removeLesson = async (req, res, next) => {
  try {
    const { slug, lessonId } = req.params;
    const course = await Course.findOne({ slug });
    if (req.user._id !== course.instructor._id.toString()) {
      return res.status(400).send("Unauthorized");
    }

    if (course.published) {
      return res.status(403).send("Cannot edit published course");
    }

    // remove video if exist
    const lesson = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    );

    if (!isEmpty(lesson.video)) {
      await removeVideoFromS3({
        Bucket: lesson.video.Bucket,
        Key: lesson.video.Key,
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(course._id, {
      $pull: { lessons: { _id: lessonId } },
    });
    res.json(updatedCourse);
  } catch (err) {
    next(err);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).select("instructor");
    if (req.user._id !== course.instructor._id.toString()) {
      return res.status(400).send("Unauthorized");
    }

    const { _id, title, content, video, preview } = req.body;
    await Course.updateOne(
      { "lessons._id": _id },
      {
        $set: {
          "lessons.$.title": title,
          "lessons.$.content": content,
          "lessons.$.video": video,
          "lessons.$.preview": preview,
        },
      },
      { new: true }
    );

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const publishCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor");

    if (req.user._id !== course.instructor._id.toString()) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      {
        published: true,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const unpublishCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor");

    if (req.user._id !== course.instructor._id.toString()) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      {
        published: false,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getPublishedCourses = async (req, res, next) => {
  try {
    const { page = 0, limit = 12, term = ".*" } = req.query;
    const courses = await Course.find({
      published: true,
      $or: [{ name: new RegExp(term) }, { tags: new RegExp(term) }],
    })
      .sort({ updatedAt: -1 })
      .skip(parseInt(page * limit))
      .limit(parseInt(limit))
      .populate("instructor", "_id name");

    const total = await Course.countDocuments({
      published: true,
      $or: [{ name: new RegExp(term) }, { tags: new RegExp(term) }],
    });

    res.json({ courses, total });
  } catch (err) {
    next(err);
  }
};

export const checkEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    // find courses of the currently logged in user
    const user = await User.findById(req.user._id);
    // check if course id is found in user courses array
    const enrolled = user.enrolled_courses.some(
      (course) => course._id == courseId
    );
    res.json({
      status: enrolled,
    });
  } catch (err) {
    next(err);
  }
};

export const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "instructor"
    );

    if (course.instructor._id.toString() === req.user._id) {
      return res.status(400).send("You cannot enroll in your own course");
    }

    const user = await User.findById(req.user._id);

    if (course.price > user.balance) {
      return res
        .status(400)
        .send("Not enough balance to enroll in this course");
    }

    if (course.paid) {
      // application fee 30%
      const fee = ((course.price * 30) / 100).toFixed(2);

      // add fee to admin
      await User.findOneAndUpdate(
        { role: "Admin" },
        { $inc: { balance: fee } }
      );

      // add profit to instructor
      await User.findByIdAndUpdate(course.instructor._id, {
        $inc: { balance: (course.price - fee).toFixed(2) },
      });

      // update daily report
      await DailyReport.updateOne(
        { date: moment().utc().startOf("day") },
        { $inc: { profit: fee, enrollments: 1 } },
        { upsert: true, setDefaultOnInsert: true }
      );
    }

    // enroll user
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { enrolled_courses: course._id },
        $inc: { balance: -course.price },
      },
      { new: true }
    );

    // update enroll count in course
    course.enrollments = course.enrollments + 1;
    await course.save();
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const getUserCourses = async (req, res, next) => {
  try {
    const { page = 0, limit = 8 } = req.query;
    const user = await User.findById(req.user._id);

    const courses = await Course.find({
      _id: { $in: user.enrolled_courses },
    })
      .skip(parseInt(page * limit))
      .limit(parseInt(limit))
      .populate("instructor", "_id name");

    const total = await Course.countDocuments({
      _id: { $in: user.enrolled_courses },
    });

    res.json({
      courses,
      total,
    });
  } catch (err) {
    next(err);
  }
};

export const markCompleted = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;
    // check if user with that course is already created
    const existing = await CompletedLesson.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existing) {
      // update
      await CompletedLesson.findOneAndUpdate(
        {
          user: req.user._id,
          course: courseId,
        },
        {
          $addToSet: { lessons: lessonId },
        }
      );
    } else {
      // create
      await new CompletedLesson({
        user: req.user._id,
        course: courseId,
        lessons: [lessonId],
      }).save();
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const markIncomplete = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;

    await CompletedLesson.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      {
        $pull: { lessons: lessonId },
      }
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const listCompleted = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const list = await CompletedLesson.findOne({
      user: req.user._id,
      course: courseId,
    });
    res.json(list ? list.lessons : []);
  } catch (err) {
    next(err);
  }
};

export const getTags = (req, res, next) => {
  res.json(tags);
};

export const comment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    if (title.length < 1 || title.length > 100) {
      return res.status(400).send("Title must be less than 100 characters");
    }
    if (content.length < 20 || content.length > 200) {
      return res
        .status(400)
        .send("Content must be between 20 and 500 characters");
    }
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          comments: {
            title,
            content,
            commenter: req.user._id,
          },
        },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .populate("comments.commenter", "_id name avatar");

    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const rateCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // update rating of user
    await Rating.updateOne(
      { user: req.user._id, course: courseId },
      { rating: req.body.rating },
      { upsert: true, setDefaultOnInsert: true }
    );

    // calculate average rating
    const ratings = await Rating.find({
      course: courseId,
    }).lean();

    const avgRating =
      ratings.reduce((prev, curr) => prev + curr.rating, 0) / ratings.length;

    // update course average rating
    const course = await Course.findByIdAndUpdate(
      courseId,
      { avgRating },
      { new: true }
    );

    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const getUserRating = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const rating = await Rating.find({
      user: req.user._id,
      course: courseId,
    });

    res.json(rating);
  } catch (err) {
    next(err);
  }
};
