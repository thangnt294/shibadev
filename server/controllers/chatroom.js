import ChatRoom from "../models/chatroom";

export const createChatroom = async (req, res, next) => {
  try {
    const { name } = req.body;

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name))
      res.json(400).send("Chat room name can only contain alphabets");

    const chatRoonExist = await ChatRoom.findOne({ name });

    if (chatRoonExist) {
      res.json(400).send("Chat room with the same name already exists");
    }

    const chatRoom = new Chatroom({
      name,
    });

    await chatRoom.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const getChatRooms = async (req, res, next) => {
  try {
    const chatRooms = await ChatRoom.find({});

    res.json(chatRooms);
  } catch (err) {
    next(err);
  }
};
