import { Message } from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../index.js";
import { io } from "../index.js";

//returns messages between loggedin user and selected user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChat } = req.params;

    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChat,
        },
        { senderId: userToChat, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessages", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//handle send messages
export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = cloudinary.uploader.upload(imageUrl);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage", error);
    res.status(500).json({ message: "internal server error" });
  }
};
