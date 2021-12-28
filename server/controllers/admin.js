import User from "../models/user";
import DailyReport from "../models/dailyReport";
import moment from "moment";

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

export const getDailyReport = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;
    const reports = await DailyReport.find({
      date: {
        $gte: moment.utc(fromDate),
        $lt: moment.utc(toDate).add(1, "s"),
      },
    });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};
