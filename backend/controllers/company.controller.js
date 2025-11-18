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

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; // recruiter hiện tại
    const companies = await Company.find({ userId });

    return res.status(200).json({
      success: true,
      companies, // có thể rỗng []
      message:
        companies.length > 0
          ? "Fetched your companies successfully"
          : "You don’t have any company yet",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Lấy danh sách tất cả công ty (Cho trang chủ - Public)
export const getAllCompanies = async (req, res) => {
  try {
    // Lấy tất cả công ty, chỉ lấy field cần thiết để nhẹ
    const companies = await Company.find(
      {},
      { name: 1, logo: 1, location: 1, _id: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get companies",
    });
  }
};
// 🔍 Lấy chi tiết 1 công ty
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // 🔹 Nếu không đăng nhập → public view
    if (!req.id) {
      return res.status(200).json({
        success: true,
        view: "public",
        company: {
          _id: company._id,
          name: company.name,
          logo: company.logo,
          industry: company.industry,
          location: company.location,
          website: company.website,
          foundedYear: company.foundedYear,
          description: company.description,
          tags: company.tags,
          employeeCount: company.employeeCount,
          phone: company.phone,
          email: company.email,
        },
      });
    }

    // 🔹 Nếu là recruiter → kiểm tra quyền
    const isOwner = company.userId.toString() === req.id.toString();

    if (!isOwner) {
      // Recruiter khác chỉ được xem bản công khai
      return res.status(200).json({
        success: true,
        view: "limited",
        company: {
          _id: company._id,
          name: company.name,
          logo: company.logo,
          industry: company.industry,
          description: company.description,
          location: company.location,
          website: company.website,
        },
      });
    }

    // ✅ Chính recruiter đó → full info
    return res.status(200).json({
      success: true,
      view: "private",
      company,
    });
  } catch (error) {
    console.error("❌ Error fetching company:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching company",
    });
  }
};
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
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Company ID is required",
        success: false,
      });
    }
    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    console.log(`✅ Company deleted: ${company.name} (${company._id})`);

    return res.status(200).json({
      message: "Company deleted successfully",
      success: true,
      deletedCompany: {
        id: company._id,
        name: company.name,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting company:", error.message);

    return res.status(500).json({
      message: "Internal server error while deleting company",
      success: false,
      error: error.message,
    });
  }
};
