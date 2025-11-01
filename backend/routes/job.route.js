import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getAdminJobs, // recruiter: xem job của riêng họ
  getAllJobs, // public: tất cả job
  getJobById, // public: chi tiết 1 job
  postJob, // recruiter: đăng job mới
  updateJob, // recruiter: cập nhật job
} from "../controllers/job.controller.js";

const router = express.Router();

// 🟢 Public routes — không yêu cầu đăng nhập
router.get("/get", getAllJobs);
router.get("/get/:id", getJobById);

// 🔒 Private routes — yêu cầu đăng nhập (recruiter)
router.post("/post", isAuthenticated, postJob);
router.get("/getadminjobs", isAuthenticated, getAdminJobs);
//update job
router.put("/update/:id", isAuthenticated, updateJob);

export default router;
