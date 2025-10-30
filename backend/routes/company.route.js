import express from "express";
import {
  getCompany, // Lấy danh sách công ty của user đang đăng nhập
  getCompanyById, // Lấy chi tiết 1 công ty
  registerCompany, // Tạo mới công ty
  updateCompany, // Cập nhật thông tin công ty
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// 🏢 Đăng ký công ty
router.post("/register", isAuthenticated, registerCompany);

// 📋 Lấy danh sách công ty của user đăng nhập (my companies)
router.get("/get", isAuthenticated, getCompany);

// 🔍 Lấy chi tiết công ty theo ID (có kiểm tra quyền trong controller)
router.get("/:id", isAuthenticated, getCompanyById);

// ✏️ Cập nhật công ty
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany);

export default router;
