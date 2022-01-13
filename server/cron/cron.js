import cron from "node-cron";
import DailyReport from "../models/dailyReport";
import { randomNumber } from "../utils/helpers";
import moment from "moment";

cron.schedule("0 0 * * *", async () => {
  console.log("CRON: Daily Report Created");

  await DailyReport.updateOne(
    { date: moment().utc().startOf("day") },
    {
      $inc: {
        courses: randomNumber(1, 10),
        users: randomNumber(1, 10),
        enrollments: randomNumber(1, 30),
        profit: randomNumber(10, 50),
      },
    },
    { upsert: true, setDefaultOnInsert: true }
  );
});
