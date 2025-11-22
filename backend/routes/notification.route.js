import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  unRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/get").get(isAuthenticated, getNotifications);
router.route("/read").put(isAuthenticated, markAsRead);
router.route("/unread").get(isAuthenticated, unRead);
router.route("/delete/:id").delete(isAuthenticated, deleteNotification);
router.route("/read-all").put(isAuthenticated, markAllAsRead);
export default router;
