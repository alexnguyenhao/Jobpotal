import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
  createCV,
  uploadCV, // Import hàm mới (đổi tên từ uploadResume cũ nếu cần)
  getMyCVs,
  getCVById,
  updateCV,
  deleteCV,
  makePublic,
  unShareCV,
  getPublicCV,
  getCVForRecruiter,
} from "../controllers/cv.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// 1. Tạo CV bằng Builder (Dữ liệu JSON)
router.post("/create", isAuthenticated, singleUpload, createCV);

// 2. Tạo CV bằng Upload File (FormData) - Logic mới
// Lưu ý: Đặt route này trước các route có :id
router.post("/upload", isAuthenticated, singleUpload, uploadCV);

router.get("/mine", isAuthenticated, getMyCVs);
router.get("/view/:id", isAuthenticated, getCVForRecruiter);

router.put("/share/:id", isAuthenticated, makePublic);
router.put("/unshare/:id", isAuthenticated, unShareCV);

router.get("/public/:url", getPublicCV);

// Các route dùng param :id phải để cuối cùng
router.get("/:id", isAuthenticated, getCVById);
router.put("/:id", isAuthenticated, updateCV);
router.delete("/:id", isAuthenticated, deleteCV);

export default router;
