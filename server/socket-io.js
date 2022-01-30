import socketio from "socket.io";
import http from "http";
import User from "./models/user";
import ChatRoom from "./models/chatroom";

const setUpSocketIO = (app) => {
  const server = http.createServer(app);
  const io = socketio(server, {
    cors: {
      origin: ["http://localhost:3000", "https://shibadev.net"],
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

  socket.on("user_listen", ({ userId }) => {
    socket.join(userId);
    console.log("This user is listening: " + userId);
  });

  socket.on("user_leave", ({ userId }) => {
    socket.leave(userId);
    console.log("This user is leaving: " + userId);
  });

  // send message event
  socket.on("message", async ({ roomId, userId, message }) => {
    console.log(
      `Received message ${message} from user ${userId} to room ${roomId}`
    );
    if (message.trim().length > 0) {
      const user = await User.findById(userId).select("_id name avatar");
      io.to(roomId).emit("new_message", {
        roomId,
        message: {
          user,
          content: message,
          createdAt: Date.now(),
        },
      });
      await updateMessage(roomId, userId, message);
    }
  });

  socket.on("chat_room", async ({ instructorId, chatRoom }) => {
    console.log(`Someone created a chat room with instructor ${instructorId}`);
    io.to(instructorId).emit("new_chat_room", {
      chatRoom: await ChatRoom.findById(chatRoom._id)
        .populate("users", "_id name avatar")
        .populate("messages.user", "_id name avatar"),
    });
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
