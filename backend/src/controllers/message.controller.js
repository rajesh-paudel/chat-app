import { Message } from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../index.js";
import { io } from "../index.js";
import { Notification } from "../models/notification.model.js";

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

//handle fetch notifications
export const fetchNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("error in fetch notifications", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// mark read notifications
export const readNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });
    notifications?.map((notification) => {
      notification.isRead = true;
      notification.save();
    });
    res.status(200);
  } catch (error) {
    console.log("error mark read notifications", error);
    res.status(500).json({ message: "internal server error" });
  }
};
