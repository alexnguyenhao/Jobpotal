import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/get").get(isAuthenticated, getNotifications);
router.route("/read").put(isAuthenticated, markAsRead);

export default router;
