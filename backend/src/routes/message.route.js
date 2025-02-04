import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);
export default router;
