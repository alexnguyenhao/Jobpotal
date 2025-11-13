import { CV } from "../models/cv.model.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";

export const createCV = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).select("-password");
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const cv = await CV.create({
      user: userId,
      title: req.body.title || "My CV",
      template: req.body.template || "modern",

      personalInfo: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address,
        profilePhoto: user.profilePhoto,
        summary: profile.careerObjective,
      },

      education: Array.isArray(profile.education) ? profile.education : [],

      workExperience: Array.isArray(profile.workExperience)
        ? profile.workExperience
        : [],

      skills: Array.isArray(profile.skills) ? profile.skills : [],

      certifications: Array.isArray(profile.certifications)
        ? profile.certifications
        : [],

      languages: Array.isArray(profile.languages) ? profile.languages : [],
      achievements: Array.isArray(profile.achievements)
        ? profile.achievements
        : [],
      projects: Array.isArray(profile.projects) ? profile.projects : [],
    });

    res.status(201).json({ success: true, cv });
  } catch (err) {
    console.log("CV CREATE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getMyCVs = async (req, res) => {
  const cvs = await CV.find({ user: req.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, cvs });
};

export const getCVById = async (req, res) => {
  const cv = await CV.findById(req.params.id);

  if (!cv)
    return res.status(404).json({ success: false, message: "CV not found" });

  // user cannot access someone else private CV
  if (!cv.isPublic && cv.user.toString() !== req.id) {
    return res
      .status(403)
      .json({ success: false, message: "Permission denied" });
  }

  res.status(200).json({ success: true, cv });
};

/* -----------------------------------
   UPDATE CV (protected)
----------------------------------- */
export const updateCV = async (req, res) => {
  const cv = await CV.findById(req.params.id);

  if (!cv)
    return res.status(404).json({ success: false, message: "CV not found" });
  if (cv.user.toString() !== req.id)
    return res
      .status(403)
      .json({ success: false, message: "Permission denied" });

  const updated = await CV.findByIdAndUpdate(cv._id, req.body, { new: true });

  res.status(200).json({ success: true, cv: updated });
};
export const deleteCV = async (req, res) => {
  const cv = await CV.findById(req.params.id);

  if (!cv)
    return res.status(404).json({ success: false, message: "CV not found" });
  if (cv.user.toString() !== req.id)
    return res
      .status(403)
      .json({ success: false, message: "Permission denied" });

  await CV.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: "CV deleted" });
};
export const makePublic = async (req, res) => {
  const cv = await CV.findById(req.params.id);

  if (!cv)
    return res.status(404).json({ success: false, message: "CV not found" });
  if (cv.user.toString() !== req.id)
    return res
      .status(403)
      .json({ success: false, message: "Permission denied" });
  const shareUrl = crypto.randomBytes(8).toString("hex");

  cv.isPublic = true;
  cv.shareUrl = shareUrl;
  await cv.save();

  res.status(200).json({
    success: true,
    url: `${process.env.FRONTEND_URL}/cv/view/${shareUrl}`,
  });
};

export const getPublicCV = async (req, res) => {
  const cv = await CV.findOne({ shareUrl: req.params.url, isPublic: true });

  if (!cv)
    return res
      .status(404)
      .json({ success: false, message: "Public CV not found" });

  res.status(200).json({ success: true, cv });
};
export const unShareCV = async (req, res) => {
  const cv = await CV.findById(req.params.id);
  if (!cv)
    return res.status(404).json({ success: false, message: "CV not found" });
  if (cv.user.toString() !== req.id)
    return res
      .status(403)
      .json({ success: false, message: "Permission denied" });

  cv.isPublic = false;
  cv.shareUrl = null;
  await cv.save();

  res.status(200).json({ success: true, message: "CV unshared" });
};
