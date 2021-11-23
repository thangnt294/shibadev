import User from "../models/user";

export const becomeInstructor = async (req, res) => {
  // make user instructor
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
};

export const getCurrentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
    if (!user.role.includes("Instructor")) {
      // not an instructor
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};
