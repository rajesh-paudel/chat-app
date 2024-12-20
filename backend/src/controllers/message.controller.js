import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in sidebar user fetch", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userToChat } = req.params;
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

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = cloudinary.uploader.upload(imageUrl);
      const imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    //todo:realtime functionality
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage", error);
    res.status(500).jsoon({ message: "internal server error" });
  }
};
