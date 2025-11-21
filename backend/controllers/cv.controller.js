import { CV } from "../models/cv.model.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
export const createCV = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

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
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phoneNumber,
        address: user.address,
        profilePhoto: user.profilePhoto,
        summary: profile.careerObjective,
        position: req.body.position || "",
      },

      education: profile.education || [],
      workExperience: profile.workExperience || [],
      skills: profile.skills || [],
      certifications: profile.certifications || [],
      languages: profile.languages || [],
      achievements: profile.achievements || [],
      projects: profile.projects || [],

      styleConfig: {
        fontFamily: "font-sans",
        fontSizeClass: "text-base",
        primaryColor: "#4D6CFF",
        backgroundColor: "#ffffff",
        textColor: "#111",
        spacing: "normal",
        borderRadius: 12,
        shadowLevel: 1,
      },
    });

    res.status(201).json({ success: true, cv });
  } catch (err) {
    console.log("CV CREATE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyCVs = async (req, res) => {
  const userId = req.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const cvs = await CV.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, cvs });
};

export const getCVById = async (req, res) => {
  const cv = await CV.findById(req.params.id);

  if (!cv)
    return res.status(404).json({ success: false, message: "CV not found" });

  // If not public, only owner can view
  if (!cv.isPublic && cv.user.toString() !== req.id) {
    return res
      .status(403)
      .json({ success: false, message: "Permission denied" });
  }

  res.status(200).json({ success: true, cv });
};

export const updateCV = async (req, res) => {
  try {
    const cvId = req.params.id;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cv = await CV.findById(cvId);
    if (!cv)
      return res.status(404).json({ success: false, message: "CV not found" });

    // ❗ MUST check permission
    if (cv.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    const updatedCV = await CV.findByIdAndUpdate(
      cvId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ success: true, cv: updatedCV });
  } catch (err) {
    console.log("CV UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
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

export const getPublicCV = async (req, res) => {
  const cv = await CV.findOne({ shareUrl: req.params.url, isPublic: true });

  if (!cv)
    return res
      .status(404)
      .json({ success: false, message: "Public CV not found" });

  res.status(200).json({ success: true, cv });
};

export const getCVForRecruiter = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    return res.status(200).json({
      success: true,
      cv,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
