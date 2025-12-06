import express from "express";
import {
  sendMessage,
  getMessages,
  getConversationsUser,
  markAsRead,
  hideConversation,
  deleteConversation,
} from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/conversations", isAuthenticated, getConversationsUser);
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:id", isAuthenticated, sendMessage);
router.post("/mark-read/:id", isAuthenticated, markAsRead);
router.put("/hide/:id", isAuthenticated, hideConversation);
router.delete("/delete/:id", isAuthenticated, deleteConversation);

export default router;
