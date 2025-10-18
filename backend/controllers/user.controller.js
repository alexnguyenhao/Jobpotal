import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataURI from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../libs/send-email.js";
import Verification from "../models/verification.js";
import { verifyEmailTemplate } from "../templates/verifyEmailTemplate.js";
import { aj } from "../libs/arcjet.js";

export const register = async (req, res) => {
  try {
    // ✅ ARCJET rate limit
    const decision = await aj.protect(req, {
      requested: 5, // số token (rate limit)
      email: req.body.email, // truyền email cho Arcjet kiểm tra
    });
    console.log("Arcjet decision:", decision.isDenied());
    if (decision.isDenied()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid email", success: false }));
      return;
    }

    // ✅ Lấy dữ liệu từ body
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

    // ✅ Kiểm tra dữ liệu thiếu
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

    // ✅ Ảnh đại diện
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile photo is required",
        success: false,
      });
    }
    const fileUri = getDataURI(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // ✅ Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    // ✅ Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Tạo profile theo role
    const profileData =
      role === "student"
        ? {
            profilePhoto: cloudResponse.secure_url,
            bio: "",
            skills: [],
            resume: "",
            careerObjective: "",
            workExperience: [],
            education: [],
            certifications: [],
            languages: [],
            achievements: [],
            projects: [],
          }
        : { profilePhoto: cloudResponse.secure_url };

    // ✅ Tạo user mới
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

    // ✅ Token xác thực email
    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
    });

    // ✅ Gửi email xác thực (non-blocking)
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailSubject = "Verify Your Email";
    const emailBody = verifyEmailTemplate({ fullName, verificationLink });

    sendEmail(email, emailSubject, emailBody)
      .then(() => console.log("✅ Verification email sent:", email))
      .catch((err) => console.error("❌ Failed to send email:", err));

    // ✅ Trả về phản hồi nhanh
    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      success: true,
      user: newUser,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token; // ✅ GET param

    if (!token) {
      return res.status(400).json({
        message: "Verification token is missing",
        success: false,
      });
    }

    // Tìm record trong DB
    const verificationRecord = await Verification.findOne({ token });
    if (!verificationRecord) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
        success: false,
      });
    }

    // ✅ Xác minh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      console.error("JWT verify failed:", err);
      return res.status(400).json({
        message: "Invalid or expired verification link",
        success: false,
      });
    }

    // ✅ Tìm user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ Đánh dấu đã xác thực email
    user.isEmailVerified = true;
    await user.save();
    await Verification.deleteOne({ _id: verificationRecord._id });

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (err) {
    console.error("❌ Email verification error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 🧩 1️⃣ Kiểm tra dữ liệu đầu vào
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        success: false,
      });
    }

    // 🧩 2️⃣ Kiểm tra user có tồn tại không
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or account does not exist",
        success: false,
      });
    }

    // 🧩 3️⃣ Kiểm tra password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // 🧩 4️⃣ Kiểm tra role
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }

    // 🧩 5️⃣ Kiểm tra xác thực email
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }

    // 🧩 6️⃣ Tạo token
    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // 🧩 7️⃣ Chuẩn bị dữ liệu trả về (ẩn password)
    const sanitizedUser = {
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

    // 🧩 8️⃣ Gửi cookie + phản hồi thành công
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${user.fullName}!`,
        user: sanitizedUser,
        success: true,
      });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
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
