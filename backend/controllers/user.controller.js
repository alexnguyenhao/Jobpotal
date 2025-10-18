import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataURI from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../libs/send-email.js";
import Verification from "../models/verification.js";

export const register = async (req, res) => {
  try {
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
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !role ||
      !address ||
      !dateOfBirth ||
      !gender
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile photo is required",
        success: false,
      });
    }
    const fileUri = getDataURI(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo profile phù hợp với từng role
    let profileData = {
      profilePhoto: cloudResponse.secure_url,
    };

    if (role === "student") {
      profileData = {
        ...profileData,
        bio: "",
        skills: [],
        resume: "",
        resumeOriginalName: "",
        careerObjective: "",
        workExperience: [],
        education: [],
        certifications: [],
        languages: [],
        achievements: [],
        projects: [],
      };
    } else if (role === "recruiter") {
      profileData = {
        profilePhoto: cloudResponse.secure_url,
      };
    }
    // recruiter chỉ cần profilePhoto (và company nếu có, bạn có thể bổ sung sau)

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      address,
      dateOfBirth,
      gender,
      role,
      profile: profileData,
    });
    // Tạo token xác thực email
    const verificationToken = jwt.sign(
      { userId: newUser._id, property: "email-Verification" },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: Date.now() + 3600000, // 1 hour
    });
    // Gửi email xác thực
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailSubject = "Email Verification";
    const emailBody = `
  <p>Hello <strong>${fullName}</strong>,</p>
  <p>Please verify your email by clicking the link below:</p>
  <p><a href="${verificationLink}" target="_blank">Verify Email</a></p>
  <p>This link will expire in 1 hour.</p>
  <p>Thank you!</p>
`;
    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
        success: false,
      });
    }
    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      success: true,
      user: newUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (err) {
    console.log(err);
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
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Nếu có file thì update CV
    if (file) {
      const fileUri = getDataURI(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        access_mode: "public",
      });

      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    // Cập nhật thông tin cơ bản
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (projects !== undefined) {
      user.profile.projects = Array.isArray(projects)
        ? projects
        : JSON.parse(projects); // nếu gửi JSON string từ client
    }

    // Cập nhật profile
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) {
      user.profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());
    }
    if (careerObjective !== undefined)
      user.profile.careerObjective = careerObjective;
    if (workExperience !== undefined) {
      user.profile.workExperience = Array.isArray(workExperience)
        ? workExperience
        : JSON.parse(workExperience); // nếu gửi JSON string từ client
    }
    if (education !== undefined) {
      user.profile.education = Array.isArray(education)
        ? education
        : JSON.parse(education);
    }
    if (certifications !== undefined) {
      user.profile.certifications = Array.isArray(certifications)
        ? certifications
        : JSON.parse(certifications);
    }
    if (languages !== undefined) {
      user.profile.languages = Array.isArray(languages)
        ? languages
        : JSON.parse(languages);
    }
    if (achievements !== undefined) {
      user.profile.achievements = Array.isArray(achievements)
        ? achievements
        : achievements.split(",").map((a) => a.trim());
    }

    // recruiter có thể cập nhật công ty
    if (company !== undefined && user.role === "recruiter") {
      user.profile.company = company;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        role: user.role,
        profile: user.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
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

//update email
export const changeEmail = async (req, res) => {
  try {
    const userId = req.id;
    const { newEmail, password } = req.body;
    if (!newEmail || !password) {
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Password is incorrect", success: false });
    }
    const emailExist = await User.findOne({ email: newEmail });
    if (emailExist) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }
    user.email = newEmail;
    await user.save();
    return res
      .status(200)
      .json({ message: "Email updated successfully", success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

//update avatar
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.id;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }
    const fileUri = getDataURI(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      access_mode: "public",
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    user.profile.profilePhoto = cloudResponse.secure_url;
    await user.save();

    return res.status(200).json({
      message: "Avatar updated successfully",
      profilePhoto: user.profile.profilePhoto,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
