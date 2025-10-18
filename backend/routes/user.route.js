import express from "express";
import {
  register,
  login,
  updateProfile,
  logout,
  changePassword,
  updateAvatar,
  verifyEmail,
  getMyProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify-email").get(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/change-password").post(isAuthenticated, changePassword);
router.route("/update-avatar").put(isAuthenticated, singleUpload, updateAvatar);
router.route("/profile").get(isAuthenticated, getMyProfile);
export default router;
