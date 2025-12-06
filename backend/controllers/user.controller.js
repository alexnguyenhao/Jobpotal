// controllers/user.controller.js
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataURI from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../libs/send-email.js";
import Verification from "../models/verification.js";
import { verifyEmailTemplate } from "../templates/verifyEmailTemplate.js";
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate.js";
import { aj } from "../libs/arcjet.js";
import { Job } from "../models/job.model.js";
import otpGenerator from "otp-generator";
import { twoFactorAuthTemplate } from "../templates/twoFactorAuthTemplate.js";

export const register = async (req, res) => {
  try {
    const decision = await aj.protect(req, {
      requested: 5,
      email: req.body.email,
    });
    if (decision.isDenied()) {
      return res.status(403).json({ message: "Invalid email", success: false });
    }

    const {
      fullName,
      email,
      phoneNumber,
      password,
      address,
      dateOfBirth,
      gender,
      role,
    } = req.body;

    if (role === "student") {
      if (
        !fullName ||
        !email ||
        !phoneNumber ||
        !password ||
        !address ||
        !dateOfBirth ||
        !gender
      ) {
        return res.status(400).json({
          message: "Please fill all required fields for student registration.",
          success: false,
        });
      }
    } else if (role === "recruiter") {
      if (!fullName || !email || !password || !role || !gender) {
        return res.status(400).json({
          message: "Please fill name, email, password, and role.",
          success: false,
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid role type", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = "";
    if (req.file && role === "student") {
      const fileUri = getDataURI(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber: phoneNumber || "",
      password: hashedPassword,
      address: address || "",
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      role,
      profilePhoto: profilePhotoUrl || "",
    });

    const profileData = {
      user: newUser._id,
      title: "",
      skills: [],
      careerObjective: "",
      workExperience: [],
      education: [],
      certifications: [],
      languages: [],
      projects: [],
      achievements: [],
      operations: [],
      interests: "",
    };

    const newProfile = await Profile.create(profileData);
    newUser.profile = newProfile._id;
    await newUser.save();

    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailSubject = "Verify Your Email";
    const emailBody = verifyEmailTemplate({ fullName, verificationLink });

    await sendEmail(email, emailSubject, emailBody);

    const userWithProfile = await User.findById(newUser._id)
      .populate("profile")
      .select("-password");
    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      success: true,
      user: userWithProfile,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token)
      return res
        .status(400)
        .json({ message: "Verification token is missing", success: false });

    const verificationRecord = await Verification.findOne({ token });
    if (!verificationRecord)
      return res.status(400).json({
        message: "Invalid or expired verification token",
        success: false,
      });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch {
      return res.status(400).json({
        message: "Invalid or expired verification link",
        success: false,
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.isEmailVerified = true;
    await user.save();
    await Verification.deleteOne({ _id: verificationRecord._id });

    return res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (err) {
    console.error("❌ Email verification error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({
        message: "Please fill in all required fields",
        success: false,
      });

    const user = await User.findOne({ email }).populate("profile");
    if (!user)
      return res.status(400).json({
        message: "Incorrect email or account does not exist",
        success: false,
      });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });

    if (role !== user.role)
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    if (user.status === "banned")
      return res.status(403).json({
        message:
          "Your account has been banned by admin please contact admin for more details",
        success: false,
      });
    if (!user.isEmailVerified)
      return res.status(403).json({
        message: "Please verify your email before logging in",
        success: false,
      });

    if (user.is2FAEnabled) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      user.twoFAOtp = otp;
      user.twoFAOtpExpires = Date.now() + 5 * 60 * 1000;
      await user.save();
      const emailSubject = "Login Verification Code (2FA)";
      const emailBody = twoFactorAuthTemplate(otp);
      await sendEmail(user.email, emailSubject, emailBody);

      return res.status(200).json({
        message: "OTP sent to your email. Please verify to complete login.",
        success: true,
        require2FA: true,
        userId: user._id,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, company: user.company || null },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${user.fullName}!`,
        user,
        success: true,
      });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const user = await User.findById(userId).populate("profile");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (!user.twoFAOtp || user.twoFAOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (user.twoFAOtpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired", success: false });
    }

    user.twoFAOtp = null;
    user.twoFAOtpExpires = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role, company: user.company || null },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${user.fullName}!`,
        user,
        success: true,
      });
  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const toggle2FA = async (req, res) => {
  try {
    const userId = req.id;
    const { enable } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.is2FAEnabled = enable;
    await user.save();

    return res.status(200).json({
      message: `Two-Factor Authentication is now ${
        enable ? "Enabled" : "Disabled"
      }`,
      success: true,
      is2FAEnabled: user.is2FAEnabled,
    });
  } catch (err) {
    console.error("❌ Toggle 2FA error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("profile");
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const {
      fullName,
      email,
      title,
      phoneNumber,
      address,
      dateOfBirth,
      gender,
      bio,
      careerObjective,
      skills,
      workExperience,
      education,
      certifications,
      languages,
      achievements,
      projects,
      operations,
      interests,
      socialLinks,

      company,
    } = req.body;

    const file = req.file;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const profile = await Profile.findOne({ user: userId });
    if (!profile)
      return res
        .status(404)
        .json({ message: "Profile not found", success: false });

    // 1. Update User Info
    if (file) {
      const fileUri = getDataURI(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        access_mode: "public",
      });
      user.profilePhoto = cloudResponse.secure_url;
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (bio !== undefined) user.bio = bio;
    if (company !== undefined && user.role === "recruiter")
      user.company = company;

    await user.save();
    const parseJsonIfNeeded = (data) => {
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (e) {
          return [];
        }
      }
      return data;
    };

    if (title !== undefined) profile.title = title;
    if (careerObjective !== undefined)
      profile.careerObjective = careerObjective;
    if (interests !== undefined) profile.interests = interests;
    if (socialLinks !== undefined)
      profile.socialLinks = parseJsonIfNeeded(socialLinks);
    if (workExperience !== undefined)
      profile.workExperience = parseJsonIfNeeded(workExperience);
    if (education !== undefined)
      profile.education = parseJsonIfNeeded(education);
    if (certifications !== undefined)
      profile.certifications = parseJsonIfNeeded(certifications);
    if (languages !== undefined)
      profile.languages = parseJsonIfNeeded(languages);
    if (achievements !== undefined)
      profile.achievements = parseJsonIfNeeded(achievements);
    if (projects !== undefined) profile.projects = parseJsonIfNeeded(projects);
    if (operations !== undefined)
      profile.operations = parseJsonIfNeeded(operations);
    if (skills !== undefined) {
      const parsedSkills = parseJsonIfNeeded(skills);
      if (Array.isArray(parsedSkills) && parsedSkills.length > 0) {
        if (typeof parsedSkills[0] === "string") {
          profile.skills = parsedSkills.map((s) => ({
            name: s,
            level: "Intermediate",
          }));
        } else {
          profile.skills = parsedSkills;
        }
      } else {
        profile.skills = [];
      }
    }

    await profile.save();

    const updatedUser = await User.findById(userId)
      .populate("profile")
      .select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.id;
    const file = req.file;
    if (!file)
      return res
        .status(400)
        .json({ message: "No file uploaded", success: false });

    const fileUri = getDataURI(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      access_mode: "public",
    });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.profilePhoto = cloudResponse.secure_url;
    await user.save();

    return res.status(200).json({
      message: "Avatar updated successfully",
      profilePhoto: user.profilePhoto,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Missing fields", success: false });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Old password is incorrect", success: false });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const resetToken = jwt.sign(
      { userId: user._id, purpose: "password-reset" },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailSubject = "Password Reset Request";
    const emailBody = resetPasswordTemplate(user.fullName, resetLink);

    await sendEmail(email, emailSubject, emailBody);
    return res
      .status(200)
      .json({ message: "Password reset email sent", success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Missing fields", success: false });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      console.error("JWT verify failed:", err);
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res
      .status(200)
      .json({ message: "Password reset successfully", success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const saveJob = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({
        message: "Job already saved",
        success: false,
      });
    }

    user.savedJobs.push(jobId);
    await user.save();

    return res.status(200).json({
      message: "Job saved successfully",
      success: true,
    });
  } catch (err) {
    console.error("Save Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.savedJobs = user.savedJobs.filter(
      (id) => id.toString() !== jobId.toString()
    );

    await user.save();
    return res.status(200).json({
      message: "Job removed from saved list",
      success: true,
    });
  } catch (err) {
    console.error("Unsave Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate({
      path: "savedJobs",
      populate: { path: "company category" },
    });

    return res.status(200).json({
      success: true,
      savedJobs: user.savedJobs || [],
    });
  } catch (err) {
    console.error("Get Saved Jobs Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("profile");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      user,
      success: true,
    });
  } catch (err) {
    console.error("Get User By ID Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
