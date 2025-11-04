import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteJob,
  searchJobs,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Public routes
router.get("/get", getAllJobs);
router.get("/search", searchJobs); // ✅ route mới

// Authenticated routes
router.get("/admin", isAuthenticated, getAdminJobs);
router.post("/post", isAuthenticated, postJob);
router.get("/get/:id", getJobById);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);

export default router;
