import { CV } from "../models/cv.model.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import getDataURI from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

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

    const cv = await CV.create({
      user: userId,
      title: req.body.title || "My CV",
      type: "builder",
      template: req.body.template || "modern",

      personalInfo: {
        fullName: user.fullName || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phoneNumber,
        address: user.address,
        profilePhoto: user.profilePhoto,
        summary: user.bio || "",
        position: req.body.position || "",
      },

      education: profile?.education || [],
      workExperience: profile?.workExperience || [],
      skills: profile?.skills || [],
      certifications: profile?.certifications || [],
      languages: profile?.languages || [],
      achievements: profile?.achievements || [],
      projects: profile?.projects || [],
      operations: profile?.operations || [],
      interests: profile?.interests,

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
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const uploadCV = async (req, res) => {
  try {
    const userId = req.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    if (file.size > 10485760) {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum is 10MB.",
      });
    }

    const fileUri = getDataURI(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "auto",
      folder: "cv_uploads",
      public_id: `cv_${userId}_${Date.now()}`,
    });

    const cv = await CV.create({
      user: userId,
      title: req.body.title || file.originalname,
      type: "upload",
      fileData: {
        url: cloudResponse.secure_url,
        publicId: cloudResponse.public_id,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
      personalInfo: {
        fullName: req.body.fullName || "",
      },
    });

    return res.status(201).json({
      success: true,
      cv,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyCVs = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cvs = await CV.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, cvs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCVById = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv)
      return res.status(404).json({ success: false, message: "CV not found" });

    if (!cv.isPublic && cv.user.toString() !== req.id) {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }

    res.status(200).json({ success: true, cv });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
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
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCV = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv)
      return res.status(404).json({ success: false, message: "CV not found" });

    if (cv.user.toString() !== req.id)
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });

    if (cv.fileData && cv.fileData.publicId) {
      await cloudinary.uploader.destroy(cv.fileData.publicId);
    }

    await CV.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "CV deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const makePublic = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unShareCV = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPublicCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ shareUrl: req.params.url, isPublic: true });

    if (!cv)
      return res
        .status(404)
        .json({ success: false, message: "Public CV not found" });

    res.status(200).json({ success: true, cv });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
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
