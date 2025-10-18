import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "cloudinary";

// 🏢 Đăng ký công ty
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({
        message: "You can't register same company name twice",
        success: false,
      });
    }

    const company = await Company.create({
      name: companyName,
      userId: req.id, // lấy từ middleware auth
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// 📋 Lấy danh sách công ty theo user
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found for this user",
        success: false,
      });
    }

    res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// 🔍 Lấy chi tiết 1 công ty
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    res.status(200).json({ company, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ✏️ Cập nhật thông tin công ty (phiên bản mới nhất)
export const updateCompany = async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      location,
      industry,
      foundedYear,
      employeeCount,
      phone,
      email,
      tags,
      status,
      isVerified,
    } = req.body;

    // 🧩 Xử lý upload ảnh (nếu có)
    let logo;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudRes = await cloudinary.uploader.upload(fileUri.content, {
        folder: "company_logos",
      });
      logo = cloudRes.secure_url;
    }

    // 🧠 Xử lý các field phức tạp
    const parsedTags = tags
      ? typeof tags === "string"
        ? JSON.parse(tags)
        : tags
      : [];

    const updateData = {
      name,
      description,
      website,
      location,
      industry,
      foundedYear,
      employeeCount,
      phone,
      email,
      tags: parsedTags,
      status,
      isVerified,
    };

    // Chỉ gán logo mới nếu có file upload
    if (logo) updateData.logo = logo;

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
