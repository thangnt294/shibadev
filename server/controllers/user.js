import User from "../models/user";
import { uploadImageToS3, removeImageFromS3, isEmpty } from "../utils/helpers";

export const uploadAvatar = async (req, res, next) => {
  try {
    const { image } = req.body;
    if (isEmpty(image)) {
      throw new Error("No image found");
    }
    const user = await User.findById(req.user._id);
    if (!isEmpty(user.avatar)) {
      await removeImageFromS3(user.avatar);
    }
    const uploadedImage = await uploadImageToS3(image, req.user.email);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: uploadedImage,
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const removeAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!isEmpty(user.avatar)) {
      await removeImageFromS3(user.avatar);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: null,
      },
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, title, address, bio } = req.body;
    if (isEmpty(name)) {
      throw new Error("Name is required");
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, title, address, bio },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};
