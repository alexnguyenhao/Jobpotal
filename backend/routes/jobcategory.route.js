import express from "express";
import {
  createJobCategory,
  getAllJobCategories,
  getJobCategoryById,
  updateJobCategory,
  deleteJobCategory,
} from "../controllers/jobcategory.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();
router.route("/create").post(isAuthenticated, isAdmin, createJobCategory);
router.route("/get").get(getAllJobCategories);
router.route("/get/:id").get(getJobCategoryById);
router.route("/update/:id").put(isAuthenticated, isAdmin, updateJobCategory);
router.route("/delete/:id").delete(isAuthenticated, isAdmin, deleteJobCategory);
export default router;
