import AWS from "aws-sdk";
import Course from "../models/course";
import slugify from "slugify";
import User from "../models/user";
import CompletedLesson from "../models/completedLesson";
import { tags } from "../constants";
import {
  isEmpty,
  uploadImageToS3,
  removeImageFromS3,
  uploadVideoToS3,
  removeVideoFromS3,
} from "../utils/helpers";

export const create = async (req, res, next) => {
  try {
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
      const data = await uploadImageToS3(uploadImage);
      newCourse.image = data;
    }
    delete newCourse.uploadImage;
    const course = await new Course(newCourse).save();
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).exec();
    if (req.user._id != course.instructor) {
      return res.status(400).send("Unauthorized");
    }

    const { removedImage, uploadImage } = req.body;
    const updatedCourse = req.body;

    if (!isEmpty(uploadImage)) {
      if (!isEmpty(removedImage)) {
        const { image } = req.body;

        await removeImageFromS3(image);
      }

      const data = await uploadImageToS3(uploadImage);
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
    }).exec();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .exec();
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
    const data = await uploadVideoToS3(video);
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
    )
      .populate("instructor", "_id name")
      .exec();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const removeLesson = async (req, res, next) => {
  try {
    const { slug, lessonId } = req.params;
    const course = await Course.findOne({ slug }).exec();
    if (req.user._id != course.instructor) {
      return res.status(400).send("Unauthorized");
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
    }).exec();
    res.json(updatedCourse);
  } catch (err) {
    next(err);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const { slug, instructorId } = req.params;
    const course = await Course.findOne({ slug }).select("instructor").exec();
    if (req.user._id != course.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    const { _id, title, content, video, free_preview } = req.body;
    await Course.updateOne(
      { "lessons._id": _id },
      {
        $set: {
          "lessons.$.title": title,
          "lessons.$.content": content,
          "lessons.$.video": video,
          "lessons.$.free_preview": free_preview,
        },
      },
      { new: true }
    ).exec();

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const publishCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor").exec();

    if (req.user._id != course.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      {
        published: true,
      },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const unpublishCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor").exec();

    if (req.user._id != course.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      {
        published: false,
      },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getPublishedCourses = async (req, res, next) => {
  try {
    const { page = 0, limit = 9, sort = 1, term = ".*" } = req.query;
    const publishedCourses = await Course.find({
      published: true,
      $or: [{ name: new RegExp(term) }, { tags: new RegExp(term) }],
    })
      .sort({ createdAt: sort })
      .skip(parseInt(page * limit))
      .limit(parseInt(limit))
      .populate("instructor", "_id name");

    const total = await Course.find({
      published: true,
      $or: [{ name: new RegExp(term) }, { tags: new RegExp(term) }],
    }).countDocuments();

    res.json({
      courses: publishedCourses,
      total,
    });
  } catch (err) {
    next(err);
  }
};

export const checkEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    // find courses of the currently logged in user
    const user = await User.findById(req.user._id).exec();
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
    const course = await Course.findById(req.params.courseId)
      .populate("instructor")
      .exec();

    // application fee 30%
    if (course.paid) {
      const fee = ((course.price * 30) / 100).toFixed(2);

      // add fee to admin
      await User.findOneAndUpdate(
        { role: "Admin" },
        { $inc: { balance: fee } }
      );

      // add profit to instructor
      await User.findByIdAndUpdate(course.instructor._id, {
        $inc: { balance: course.price - fee },
      });
    }

    // enroll user
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { enrolled_courses: course._id },
      },
      { new: true }
    ).exec();
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const getUserCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();

    const userCourses = await Course.find({
      _id: { $in: user.enrolled_courses },
    })
      .populate("instructor", "_id name")
      .exec();

    res.json(userCourses);
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
    }).exec();

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
      ).exec();
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
    ).exec();
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
    }).exec();
    res.json(list ? list.lessons : []);
  } catch (err) {
    next(err);
  }
};

export const getTags = (req, res, next) => {
  res.json(tags);
};
