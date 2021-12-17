import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import {
  checkEmailVerifiedSES,
  sendResetPasswordEmail,
  verifyEmail,
} from "../utils/helpers";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }

    let userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .send("This email is already taken. Please use another email.");
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
    if (!user) return res.status(400).send("Incorrect username or password");

    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Incorrect username or password");

    if (!user.is_verified) {
      const emailVerified = await checkEmailVerifiedSES(email);
      if (!emailVerified)
        return res.status(400).send("Please verify your email");
      await User.findByIdAndUpdate(user._id, { is_verified: true });
    }

    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // return user and token to client, exclude hashed password
    user.password = undefined;
    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetCode = nanoid(6).toUpperCase();
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).send("Incorrect email. Please try again.");
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

    // prepare for email
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
      { password: hashedPassword, passwordResetCode: "" }
    );
    if (!user)
      return res.status(400).send("Reset code incorrect. Please try again.");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
