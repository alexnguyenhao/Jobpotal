import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
import { CareerGuide } from "../models/careerGuide.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { sendEmail } from "../libs/send-email.js";
import { getReceiverSocketId, io } from "../socket.js";
import { companyStatusTemplate } from "../templates/companyStatusTemplate.js";
import e from "cors";
import { jobStatusTemplate } from "../templates/jobStatusTemplate.js";
import { userStatusTemplate } from "../templates/userStatusTemplate.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Email is not registered", success: false });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Password is incorrect", success: false });
    }
    const tokenData = {
      userId: admin._id,
      role: "admin",
      company: null,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome Admin ${admin.fullName}`,
        success: true,
        user: {
          _id: admin._id,
          fullName: admin.fullName,
          role: "admin",
        },
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// 2. Đăng xuất
export const logoutAdmin = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalCompanies, totalApplications] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Company.countDocuments(),
        Application.countDocuments(),
      ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalCompanies,
        totalApplications,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company").sort({ createdAt: -1 });
    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .populate({
        path: "applicant",
        select: "fullName email profilePhoto phoneNumber resume profile",
        populate: {
          path: "profile",
        },
      });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ users, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id).populate("userId");
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("profile");
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

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("company");
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    return res.status(200).json({
      message: "Job fetched successfully",
      job,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    return res.status(200).json({
      message: "User deleted successfully",
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
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company)
      return res
        .status(404)
        .json({ message: "Company not found", success: false });

    return res.status(200).json({
      message: "Company deleted successfully",
      company,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    return res.status(200).json({
      message: "Job deleted successfully",
      job,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const updateStatusUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!["active", "banned"].includes(newStatus)) {
      return res.status(400).json({
        message: "Invalid status value",
        success: false,
      });
    }

    user.status = newStatus;
    await user.save();
    const emailSubject = `User Status Update: ${user.fullName}`;
    const emailHtml = userStatusTemplate(user.fullName, user.email, newStatus);

    await sendEmail(user.email, emailSubject, emailHtml).catch((err) =>
      console.error("Failed to send user status email:", err)
    );

    return res.status(200).json({
      message: "User status updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log("❌ Update Status Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const activeCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id).populate("userId");

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    const newStatus = !company.isVerified;
    company.isVerified = newStatus;
    company.status = newStatus ? "active" : "inactive";

    await company.save();

    if (company.userId) {
      const user = company.userId;
      const statusText = newStatus ? "Approved" : "Deactivated";
      const notiMessage = newStatus
        ? `Congratulations! Your company "${company.name}" has been approved by Admin.`
        : `Alert! Your company "${company.name}" has been deactivated by Admin.`;

      const notification = await Notification.create({
        recipient: user._id,
        sender: req.id,
        type: "system_alert",
        message: notiMessage,
        relatedId: company._id,
        isRead: false,
      });
      const receiverSocketId = getReceiverSocketId(user._id.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
      }
      const emailSubject = `Company Status Update: ${company.name}`;
      const emailHtml = companyStatusTemplate(
        user.fullName,
        company.name,
        newStatus
      );

      await sendEmail(user.email, emailSubject, emailHtml).catch((err) =>
        console.error("Failed to send company status email:", err)
      );
    }

    return res.status(200).json({
      company,
      message: newStatus
        ? "Company approved successfully"
        : "Company deactivated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate({
      path: "company",
      populate: { path: "userId" },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    const newStatus = job.status === "Open" ? "Closed" : "Open";
    job.isVerified = newStatus;
    job.status = newStatus;
    const actionMessage = newStatus === "Closed" ? "Closed" : "Reopened";
    await job.save();

    if (job.company && job.company.userId) {
      const recruiter = job.company.userId;

      const notiMessage = `System Notice: Your job "${job.title}" has been ${actionMessage} by Admin.`;

      const notification = await Notification.create({
        recipient: recruiter._id,
        sender: req.id,
        type: "system_alert",
        message: notiMessage,
        relatedId: job._id,
        isRead: false,
      });
      await notification.populate("sender", "fullName avatar");

      const receiverSocketId = getReceiverSocketId(recruiter._id.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
      }

      const emailSubject =
        newStatus === "Closed"
          ? `🚨 Job Closed by Admin - ${job.title}`
          : `✅ Job Restored - ${job.title}`;

      const emailHtml = jobStatusTemplate(
        recruiter.fullName,
        job.title,
        newStatus.toLowerCase()
      );

      await sendEmail(recruiter.email, emailSubject, emailHtml).catch((err) =>
        console.error(" Failed to send email:", err)
      );
    }

    return res.status(200).json({
      success: true,
      message: `Job has been ${actionMessage}.`,
      job,
    });
  } catch (error) {
    console.log(" updateJobStatus Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
