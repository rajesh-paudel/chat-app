import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getFriends,
  getUsers,
  sendFriendRequest,
  unfriend,
} from "../controllers/friendRequest.controller.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

router.get("/users", protectRoute, getUsers);
router.get("/sendFriendRequest/:id", protectRoute, sendFriendRequest);
router.get("/acceptFriendRequest/:id", protectRoute, acceptFriendRequest);
router.get("/declineFriendRequest/:id", protectRoute, declineFriendRequest);
router.get("/getFriendRequests", protectRoute, getFriendRequests);
router.get("/getFriends", protectRoute, getFriends);
router.get("/unfriend/:id", protectRoute, unfriend);
export default router;
