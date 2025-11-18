import express from "express";
import {
  createCareerGuide,
  getAllCareerGuides,
  getCareerGuideById,
  updateCareerGuide,
  deleteCareerGuide,
  getCareerGuidesByRecruiter,
  getCareerGuideDetailsForRecruiter,
} from "../controllers/careerGuide.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// ================================
// PRIVATE ROUTES (PHẢI ĐỂ TRÊN)
// ================================
router.post("/create", isAuthenticated, createCareerGuide);
router.get("/mine", isAuthenticated, getCareerGuidesByRecruiter);
router.get("/mine/:id", isAuthenticated, getCareerGuideDetailsForRecruiter);
router.put("/update/:id", isAuthenticated, updateCareerGuide);
router.delete("/delete/:id", isAuthenticated, deleteCareerGuide);

// ================================
// PUBLIC ROUTES (ĐỂ SAU CÙNG)
// ================================
router.get("/", getAllCareerGuides);
router.get("/:id", getCareerGuideById);

export default router;
