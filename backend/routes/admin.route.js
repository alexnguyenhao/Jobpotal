import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  getAllCompanies,
  getAllJobs,
  getAllUsers,
  getAllApplications,
  activeCompany,
  getDashboardStats,
  getCompanyById,
  getUserProfile,
  getJobById,
  deleteUser,
  deleteCompany,
  deleteJob,
  updateStatusUser,
  updateJobStatus,
} from "../controllers/admin.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/stats", isAuthenticated, isAdmin, getDashboardStats);

router.get("/all-companies", isAuthenticated, isAdmin, getAllCompanies);
router.get("/all-jobs", isAuthenticated, isAdmin, getAllJobs);
router.get("/all-users", isAuthenticated, isAdmin, getAllUsers);
router.get("/all-applications", isAuthenticated, isAdmin, getAllApplications);
router.put("/active-company/:id", isAuthenticated, isAdmin, activeCompany);
router.get("/company/:id", isAuthenticated, isAdmin, getCompanyById);
router.get("/user/:id", isAuthenticated, isAdmin, getUserProfile);
router.get("/job/:id", isAuthenticated, isAdmin, getJobById);
router.delete("/user/:id", isAuthenticated, isAdmin, deleteUser);
router.delete("/company/:id", isAuthenticated, isAdmin, deleteCompany);
router.delete("/job/:id", isAuthenticated, isAdmin, deleteJob);
router.put(
  "/update-status-user/:id",
  isAuthenticated,
  isAdmin,
  updateStatusUser
);
router.put("/update-status-job/:id", isAuthenticated, isAdmin, updateJobStatus);
export default router;
