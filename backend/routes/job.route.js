import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteJob,
  searchJobs,
  getJobsByCompany,
  getJobsByCategory,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// ================================
// 🟢 PUBLIC ROUTES (Không cần xác thực)
// ================================

// 1. Lấy tất cả jobs (có thể kèm filter qua query)
router.get("/get", getAllJobs);

// 2. Tìm kiếm (Search jobs)
router.get("/search", searchJobs);

// 3. Lấy chi tiết một job (Public detail view)
router.get("/get/:id", getJobById);

// 4. Lấy Jobs theo Company ID (cho mục đích hiển thị công khai trên Home)
router.get("/company/:companyId", getJobsByCompany);

// 5. Lấy Jobs theo Category (cho mục đích hiển thị công khai trên Home)
router.get("/category/:categoryId", getJobsByCategory);

// ================================
// 🔴 ADMIN/RECRUITER ROUTES (Cần xác thực)
// ================================

// 6. Lấy danh sách jobs do Admin/Recruiter đăng (có thể bao gồm job nháp)
router.get("/admin/get", isAuthenticated, getAdminJobs);

// 7. Đăng Job mới
router.post("/post", isAuthenticated, postJob);

// 8. Cập nhật Job
router.put("/update/:id", isAuthenticated, updateJob);

// 9. Xóa Job
router.delete("/delete/:id", isAuthenticated, deleteJob);

export default router;
