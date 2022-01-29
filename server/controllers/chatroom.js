import ChatRoom from "../models/chatroom";

export const createChatRoom = async (req, res, next) => {
  try {
    const { users } = req.body;

    const chatRoom = new ChatRoom({
      users,
    });

    const createdChatRoom = await chatRoom.save();
    res.json(createdChatRoom);
  } catch (err) {
    next(err);
  }
};

export const getChatRooms = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const chatRooms = await ChatRoom.find({
      users: userId,
    })
      .populate("users", "_id name avatar")
      .populate("messages.user", "_id name avatar");
    res.json(chatRooms);
  } catch (err) {
    next(err);
  }
};

export const getChatRoom = async (req, res, next) => {
  try {
    const { users, roomId } = req.query;
    let chatRoom;
    if (roomId) {
      chatRoom = await ChatRoom.findById(roomId)
        .populate("users", "_id name avatar")
        .populate("messages.user", "_id name avatar");
    } else {
      chatRoom = await ChatRoom.findOne({
        users: {
          $all: users.split(","),
        },
      })
        .populate("users", "_id name avatar")
        .populate("messages.user", "_id name avatar");
    }
    res.json(chatRoom);
  } catch (err) {
    next(err);
  }
};
