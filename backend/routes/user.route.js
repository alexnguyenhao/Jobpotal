import express from "express";
import {
  register,
  login,
  updateProfile,
  logout,
  changePassword,
  changeEmail,
  updateAvatar,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/change-password").post(isAuthenticated, changePassword);
router.route("/change-email").post(isAuthenticated, changeEmail);
router.route("/update-avatar").put(isAuthenticated, singleUpload, updateAvatar);
export default router;
