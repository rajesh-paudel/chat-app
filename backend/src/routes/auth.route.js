import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  user,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getUsers,
  sendFriendRequest,
  unfriend,
} from "../controllers/friendRequest.controller.js";
import {
  fetchNotifications,
  readNotifications,
} from "../controllers/message.controller.js";

const router = express.Router();
router.post("/signup", signup);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

router.get("/users", protectRoute, getUsers);
router.get("/sendFriendRequest/:id", protectRoute, sendFriendRequest);
router.get("/acceptFriendRequest/:id", protectRoute, acceptFriendRequest);
router.get("/declineFriendRequest/:id", protectRoute, declineFriendRequest);

router.get("/unfriend/:id", protectRoute, unfriend);
router.get("/userInfo", protectRoute, user);
router.get("/notifications", protectRoute, fetchNotifications);
router.get("/readNotifications", protectRoute, readNotifications);
export default router;
