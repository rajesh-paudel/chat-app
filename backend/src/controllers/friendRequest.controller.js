import { User } from "../models/user.model.js";

//returns users list
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("error in sidebar user fetch", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const { id: userToSendRequestId } = req.params;
    const userToSendRequest = await User.findById(userToSendRequestId);

    if (loggedInUserId == userToSendRequestId) {
      return res.status(400).json({ message: " cannot follow yourself " });
    }

    if (userToSendRequest.friendRequest.includes(loggedInUserId)) {
      return res.status(400).json({ message: " user already requested " });
    }
    if (userToSendRequest.friends.includes(loggedInUserId)) {
      return res.status(400).json({ message: " user is already friend " });
    }
    await userToSendRequest.updateOne({
      $push: { friendRequest: loggedInUserId },
    });
    res.status(200).json({ message: " request sent " });
  } catch (error) {
    console.log("error in send friend request", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { id: reqSenderId } = req.params;
    const user = await User.findById(loggedInUserId);
    const reqSenderUser = await User.findById(reqSenderId);
    if (user.friends.includes(reqSenderId)) {
      return res.status(400).json({ message: "user is already friend" });
    }
    user.friends.push(reqSenderId);
    reqSenderUser.friends.push(loggedInUserId);
    reqSenderUser.save();
    await user.updateOne({ $pull: { friendRequest: reqSenderId } });
    await user.save();
    res.status(200).json({ message: " request accepted " });
  } catch (error) {
    console.log("error in accept friend request", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//decline friend request
export const declineFriendRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { id: reqSenderId } = req.params;
    const user = await User.findById(loggedInUserId);

    await user.updateOne({ $pull: { friendRequest: reqSenderId } });

    res.status(200).json({ message: "request declined" });
  } catch (error) {
    console.log("error in decline friend request", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//returns friend request list
export const getFriendRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId).populate("friendRequest");

    const friendRequests = user.friendRequest;
    res.status(200).json(friendRequests);
  } catch (error) {
    console.log("error in fetching friend requests", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//returns friends list
export const getFriends = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId).populate("friends");
    const friends = user.friends;
    res.status(200).json(friends);
  } catch (error) {
    console.log("error in fetching friends", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//unfriend user
export const unfriend = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { id: userToUnfriendId } = req.params;
    const user = await User.findById(loggedInUserId);
    const userToUnfriend = await User.findById(userToUnfriendId);

    await user.updateOne({ $pull: { friends: userToUnfriendId } });
    await userToUnfriend.updateOne({ $pull: { friends: loggedInUserId } });
    res.status(200).json({ message: "user unfriended" });
  } catch (error) {
    console.log("error in unfriend user", error);
    res.status(500).json({ message: "internal server error" });
  }
};
