import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

import {
  createCV,
  getMyCVs,
  getCVById,
  updateCV,
  deleteCV,
  makePublic,
  unShareCV,
  getPublicCV,
} from "../controllers/cv.controller.js";

const router = express.Router();

/* CRUD */
router.post("/create", isAuthenticated, createCV);
router.get("/mine", isAuthenticated, getMyCVs);
router.get("/:id", isAuthenticated, getCVById);
router.put("/:id", isAuthenticated, updateCV);
router.delete("/:id", isAuthenticated, deleteCV);

/* PUBLIC SHARE */
router.put("/share/:id", isAuthenticated, makePublic);
router.put("/unshare/:id", isAuthenticated, unShareCV);

/* PUBLIC VIEW (không cần login) */
router.get("/public/:url", getPublicCV);

export default router;
