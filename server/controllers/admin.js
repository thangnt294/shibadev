import User from "../models/user";

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
