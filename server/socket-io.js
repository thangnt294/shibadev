import socketio from "socket.io";
import http from "http";
import User from "./models/user";
import ChatRoom from "./models/chatroom";

const setUpSocketIO = (app) => {
  const server = http.createServer(app);
  const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  io.on("connection", (socket) => {
    console.log("New socket.io connection established");

    addEventToSocket(io, socket);
  });

  return server;
};

const addEventToSocket = (io, socket) => {
  // join room event
  socket.on("join", ({ roomId }) => {
    socket.join(roomId);
    console.log("A user joined chat room: " + roomId);
  });

  // leave room event
  socket.on("leave", ({ roomId }) => {
    socket.leave(roomId);
    console.log("A user left chat room: " + roomId);
  });

  // send message event
  socket.on("message", async ({ roomId, userId, message }) => {
    console.log(
      `Received message ${message} from user ${userId} to room ${roomId}`
    );
    if (message.trim().length > 0) {
      const user = await User.findById(userId).select("_id name avatar");
      io.to(roomId).emit("new_message", {
        user: user,
        content: message,
        createdAt: Date.now(),
      });
      await updateMessage(roomId, userId, message);
    }
  });
};

const updateMessage = async (roomId, userId, message) => {
  await ChatRoom.findByIdAndUpdate(roomId, {
    $push: {
      messages: {
        $each: [{ user: userId, content: message }],
        $sort: {
          createdAt: 1,
        },
      },
    },
  });
};

export default setUpSocketIO;
