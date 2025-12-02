import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getJobFitAnalysis,
  getAdminJobs,
  updateJob,
  deleteJob,
  searchJobs,
  getJobsByCompany,
  getJobsByCategory,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/get", getAllJobs);
router.get("/search", searchJobs);
router.get("/get/:id", getJobById);
router.get("/get/:id/analyze", isAuthenticated, getJobFitAnalysis);
router.get("/company/:companyId", getJobsByCompany);
router.get("/category/:categoryId", getJobsByCategory);
router.get("/recruiter/get", isAuthenticated, getAdminJobs);
router.post("/post", isAuthenticated, postJob);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/:id", isAuthenticated, deleteJob);

export default router;
