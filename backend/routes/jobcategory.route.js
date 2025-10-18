import express from "express";
import {
  createJobCategory,
  getAllJobCategories,
  getJobCategoryById,
  updateJobCategory,
  deleteJobCategory,
} from "../controllers/jobcategory.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();
router.route("/create").post(isAuthenticated, createJobCategory);
router.route("/get").get(getAllJobCategories);
router.route("/get/:id").get(getJobCategoryById);
router.route("/update/:id").put(isAuthenticated, updateJobCategory);
router.route("/delete/:id").delete(isAuthenticated, deleteJobCategory);
export default router;
