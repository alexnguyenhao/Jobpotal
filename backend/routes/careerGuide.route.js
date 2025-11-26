import express from "express";
import {
  createCareerGuide,
  getAllCareerGuides,
  getAllCareerGuidesAdmin,
  getCareerGuideById,
  getCareerGuideByIdAdmin,
  updateCareerGuide,
  deleteCareerGuide,
} from "../controllers/careerGuide.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();
router.post("/admin/create", isAuthenticated, isAdmin, createCareerGuide);
router.get("/admin", isAuthenticated, isAdmin, getAllCareerGuidesAdmin);
router.get("/admin/:id", isAuthenticated, isAdmin, getCareerGuideByIdAdmin);
router.put("/admin/:id", isAuthenticated, isAdmin, updateCareerGuide);
router.delete("/admin/:id", isAuthenticated, isAdmin, deleteCareerGuide);

router.get("/", getAllCareerGuides);
router.get("/:id", getCareerGuideById);

export default router;
