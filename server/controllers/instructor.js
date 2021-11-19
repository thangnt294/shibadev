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
