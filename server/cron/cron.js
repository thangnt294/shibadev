import cron from "node-cron";
import DailyReport from "../models/dailyReport";
import { randomNumber } from "../utils/helpers";

cron.schedule("0 0 * * *", async () => {
  console.log("CRON: Daily Report Created");
  await DailyReport.create({
    date: moment().utc().startOf("day"),
    courses: randomNumber(1, 20),
    users: randomNumber(1, 10),
    enrollments: randomNumber(1, 30),
    profit: randomNumber(10, 50),
  });
});

cron.schedule("* * * * *", async () => {
  console.log("TEST CRON OK");
});
