import cron from "node-cron";
import DailyReport from "../models/dailyReport";
import { randomNumber } from "./helpers";

cron.schedule("0 0 * * *", async () => {
  await DailyReport.create({
    date: moment().utc().startOf("day"),
    courses: randomNumber(1, 20),
    users: randomNumber(1, 10),
    enrollments: randomNumber(1, 30),
    profit: randomNumber(10, 50),
  });
});
