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
import { aj } from "../libs/arcjet.js";
import { Job } from "../models/job.model.js";

/* ==============================
   🧩 REGISTER USER
============================== */
export const register = async (req, res) => {
  try {
    // ✅ ARCJET check
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

    // ✅ Validate input by role
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

    // ✅ Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Upload avatar if provided
    let profilePhotoUrl = "";
    if (req.file && role === "student") {
      const fileUri = getDataURI(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    // ✅ Create User
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

    // ✅ Create Profile linked to user
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
    };

    const newProfile = await Profile.create(profileData);
    newUser.profile = newProfile._id;
    await newUser.save();

    // ✅ Send verification email
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

/* ==============================
   🧩 VERIFY EMAIL
============================== */
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

/* ==============================
   🧩 LOGIN
============================== */
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

    if (!user.isEmailVerified)
      return res.status(403).json({
        message: "Please verify your email before logging in",
        success: false,
      });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

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

/* ==============================
   🧩 GET PROFILE (with populate)
============================== */
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
      phoneNumber,
      address,
      dateOfBirth,
      gender,
      bio,
      title,
      skills,
      careerObjective,
      workExperience,
      education,
      certifications,
      languages,
      achievements,
      company,
      projects,
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

    // ✅ Upload resume if provided
    if (file) {
      const fileUri = getDataURI(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        access_mode: "public",
      });
      user.resume = cloudResponse.secure_url;
      user.resumeOriginalName = file.originalname;
    }

    // ✅ Update User basic info
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (bio !== undefined) user.bio = bio;
    if (title !== undefined) profile.title = title;
    if (skills !== undefined)
      profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());

    // ✅ Update Profile fields

    if (careerObjective !== undefined)
      profile.careerObjective = careerObjective;
    if (workExperience !== undefined)
      profile.workExperience = Array.isArray(workExperience)
        ? workExperience
        : JSON.parse(workExperience);
    if (education !== undefined)
      profile.education = Array.isArray(education)
        ? education
        : JSON.parse(education);
    if (certifications !== undefined)
      profile.certifications = Array.isArray(certifications)
        ? certifications
        : JSON.parse(certifications);
    if (languages !== undefined)
      profile.languages = Array.isArray(languages)
        ? languages
        : JSON.parse(languages);
    if (achievements !== undefined)
      profile.achievements = Array.isArray(achievements)
        ? achievements
        : JSON.parse(achievements);
    if (projects !== undefined)
      profile.projects = Array.isArray(projects)
        ? projects
        : JSON.parse(projects);

    if (company !== undefined && user.role === "recruiter")
      user.company = company;

    await user.save();
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

//change password
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
//sent Email forgot password
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
    //send email reset password
    const resetToken = jwt.sign(
      { userId: user._id, purpose: "password-reset" },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailSubject = "Password Reset Request";
    const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5fc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 40px auto;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #6a38c2, #5b30a6);
      color: #fff;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .body {
      padding: 30px 25px;
      line-height: 1.6;
      color: #444;
      font-size: 16px;
    }
    .body p {
      margin-bottom: 18px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #6a38c2, #5b30a6);
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 0.4px;
      transition: opacity 0.3s ease;
    }
    .button:hover {
      opacity: 0.9;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 13px;
      padding: 20px;
      border-top: 1px solid #eee;
    }
    @media (max-width: 600px) {
      .body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="body">
      <p>Hi <strong>${user.fullName}</strong>,</p>
      <p>You requested to reset your password for your <strong>Job Portal</strong> account.</p>
      <p>Click the button below to create a new password. This link will expire in <strong>1 hour</strong>.</p>

      <p style="text-align: center; margin-top: 30px;">
        <a href="${resetLink}"
           target="_blank"
           rel="noopener noreferrer"
           class="button"
           style="
             display:inline-block;
             background:linear-gradient(135deg, #6a38c2, #5b30a6);
             color:#ffffff;
             text-decoration:none;
             padding:12px 28px;
             border-radius:8px;
             font-weight:600;
             letter-spacing:0.3px;
             font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
             cursor:pointer;
           ">
          Reset Password
        </a>
      </p>

      <p>If you didn’t request a password reset, you can safely ignore this email. Your account will remain secure.</p>

      <p>Best regards,<br><strong>The Job Portal Team</strong></p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Job Portal. All rights reserved.<br/>
      This is an automated email. Please do not reply.
    </div>
  </div>
</body>
</html>
`;

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

// ✅ Save job
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
      message: "✅ Job saved successfully",
      success: true,
    });
  } catch (err) {
    console.error("❌ Save Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ❌ Remove saved job
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
      message: "🗑️ Job removed from saved list",
      success: true,
    });
  } catch (err) {
    console.error("❌ Unsave Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// 📋 Get all saved jobs
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
    console.error("❌ Get Saved Jobs Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
