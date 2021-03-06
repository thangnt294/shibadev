import User from "../models/user";
import DailyReport from "../models/dailyReport";
import { hashPassword, comparePassword } from "../utils/auth";
import {
  checkEmailVerifiedSES,
  sendResetPasswordEmail,
  verifyEmail,
  isEmpty,
} from "../utils/helpers";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import moment from "moment";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // validation
    if (isEmpty(name) || isEmpty(email)) {
      return res.status(400).send("Name and email is required");
    }
    if (isEmpty(password) || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }

    let userExist = await User.findOne({ email });
    if (!isEmpty(userExist)) {
      return res
        .status(400)
        .send("This email is already taken. Please try another email.");
    }

    await verifyEmail(email);

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    await DailyReport.updateOne(
      { date: moment().utc().startOf("day") },
      { $inc: { users: 1 } },
      { upsert: true, setDefaultOnInsert: true }
    );

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check if db has user with that email
    const user = await User.findOne({ email });
    if (isEmpty(user)) {
      return res.status(400).send("Incorrect username or password");
    }

    // check password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send("Incorrect username or password");
    }

    if (!user.is_verified) {
      const emailVerified = await checkEmailVerifiedSES(email);
      if (!emailVerified)
        return res.status(400).send("Please verify your email");
      await User.findByIdAndUpdate(user._id, { is_verified: true });
    }

    // create signed jwt
    const token = jwt.sign(
      { _id: user._id, email: email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // return user and token to client, exclude hashed password
    user.password = undefined;
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetCode = nanoid(6).toUpperCase();
    const user = await User.findOne({ email });
    if (isEmpty(user)) {
      return res.status(400).send("Incorrect email. Please try again.");
    }
    if (!user.is_verified) {
      const emailVerified = await checkEmailVerifiedSES(email);
      if (!emailVerified) {
        return res
          .status(400)
          .send("This email is not verified. Please verify your email first.");
      }
      await User.findByIdAndUpdate(user._id, { is_verified: true });
    }
    await User.findByIdAndUpdate(user._id, { passwordResetCode: resetCode });

    await sendResetPasswordEmail(email, resetCode);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    const hashedPassword = await hashPassword(newPassword);

    const user = await User.findOneAndUpdate(
      { email, passwordResetCode: code },
      { password: hashedPassword, passwordResetCode: null }
    );
    if (isEmpty(user)) {
      return res
        .status(400)
        .send("Your email or your reset code is incorrect. Please try again.");
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (isEmpty(newPassword) || newPassword.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }

    const user = await User.findById(req.user._id);

    const passwordMatch = await comparePassword(oldPassword, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .send("Your old password is incorrect. Please try again");
    }
    const samePassword = await comparePassword(newPassword, user.password);
    if (samePassword) {
      return res
        .status(400)
        .send(
          "Your new password is the same as your old one. Please update your password before saving"
        );
    }
    const hashedPassword = await hashPassword(newPassword);

    // change password
    await User.findByIdAndUpdate(req.user._id, {
      password: hashedPassword,
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
