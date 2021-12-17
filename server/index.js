import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
require("dotenv").config({ path: `.env.local` });
import { errorHandler } from "./middlewares";

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

// connect to db
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("DB connection error => ", err));

// apply middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
// csrf
app.use(csrfProtection);
app.use(errorHandler);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// app boot
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
