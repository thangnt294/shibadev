import User from "../models/user";
import { uploadImageToS3, removeImageFromS3 } from "../utils/helpers";

export const uploadAvatar = async (req, res, next) => {
  try {
    const { image } = req.body;
    if (!image) {
      throw new Error("No image found");
    }
    const user = await User.findById(req.user._id);
    if (user.image) {
      await removeImageFromS3(user.image);
    }
    const uploadedImage = await uploadImageToS3(image);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        image: uploadedImage,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const removeAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.image) {
      await removeImageFromS3(user.image);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        image: null,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};
