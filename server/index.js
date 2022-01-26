import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import socketio from "socket.io";
import http from "http";
import jwt from "express-jwt";
const morgan = require("morgan");
require("dotenv").config({ path: `.env.local` });
require("./cron/cron");

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

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// socket.io
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.user._id = payload._id;
  } catch (err) {
    next(err);
  }
});
io.on("connection", (socket) => {
  console.log("We have a new connection: " + socket.user._id);

  socket.on("join", ({ name, room }, callback) => {
    const error = false;

    if (error) {
      callback({ error: "error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

app.use((err, req, res, next) => {
  console.log("Error Handling Middleware called");
  console.log("Path: ", req.path);
  console.error("Error: ", err);
  if (err.status === 401) {
    res.status(401).send("Unauthorized. Please log in again.");
  }
  res.status(500).send("Internal server error");
});
// app boot
const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
