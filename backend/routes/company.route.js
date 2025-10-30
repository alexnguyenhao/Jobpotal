import express from "express";
import {
  getCompany, // Lấy danh sách công ty của user đang đăng nhập
  getCompanyById, // Lấy chi tiết 1 công ty
  registerCompany, // Tạo mới công ty
  updateCompany, // Cập nhật thông tin công ty
  deleteCompany, // Xóa công ty
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();
router.post("/register", isAuthenticated, registerCompany);
router.get("/get", isAuthenticated, getCompany);
router.get("/get/:id", isAuthenticated, getCompanyById);
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany);
router.delete("/delete/:id", isAuthenticated, deleteCompany);

export default router;
