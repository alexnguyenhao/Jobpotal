import { Company } from "../models/company.model.js";
import { Admin } from "../models/admin.model.js";
import { Notification } from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../socket.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "cloudinary";

export const registerCompany = async (req, res) => {
  try {
    const { companyName, taxCode } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }
    if (!taxCode) {
      return res.status(400).json({
        message: "Tax code is required",
        success: false,
      });
    }

    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({
        message: "Company name already exists",
        success: false,
      });
    }

    const company = await Company.create({
      name: companyName,
      taxCode,
      userId: req.id,
      isVerified: false,
      status: "inactive",
    });

    const admins = await Admin.find({});

    await Promise.all(
      admins.map(async (admin) => {
        const notification = await Notification.create({
          recipient: admin._id,
          sender: req.id,
          type: "new_company",
          message: `New company registration: ${companyName}`,
          relatedId: company._id,
        });

        const socketId = getReceiverSocketId(admin._id.toString());
        if (socketId) {
          io.to(socketId).emit("newNotification", notification);
        }
      })
    );

    return res.status(201).json({
      message: "Register company successfully",
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
    const userId = req.id;
    const companies = await Company.find({ userId });

    return res.status(200).json({
      success: true,
      companies,
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

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find(
      { isVerified: true, status: "active" },
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

    if (!req.id) {
      return res.status(200).json({
        success: true,
        view: "public",
        company: {
          _id: company._id,
          name: company.name,
          taxCode: company.taxCode,
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
    const isOwner = company.userId.toString() === req.id.toString();

    if (!isOwner) {
      return res.status(200).json({
        success: true,
        view: "limited",
        company: {
          _id: company._id,
          name: company.name,
          taxCode: company.taxCode,
          logo: company.logo,
          industry: company.industry,
          description: company.description,
          location: company.location,
          website: company.website,
        },
      });
    }

    return res.status(200).json({
      success: true,
      view: "private",
      company,
    });
  } catch (error) {
    console.error("Error fetching company:", error);
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
      taxCode,
      description,
      website,
      location,
      industry,
      foundedYear,
      employeeCount,
      phone,
      email,
      tags,
    } = req.body;
    let logo;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudRes = await cloudinary.uploader.upload(fileUri.content, {
        folder: "company_logos",
      });
      logo = cloudRes.secure_url;
    }
    const parsedTags = tags
      ? typeof tags === "string"
        ? JSON.parse(tags)
        : tags
      : [];

    const updateData = {
      name,
      taxCode,
      description,
      website,
      location,
      industry,
      foundedYear,
      employeeCount,
      phone,
      email,
      tags: parsedTags,
    };
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

    return res.status(200).json({
      message: "Company deleted successfully",
      success: true,
      deletedCompany: {
        id: company._id,
        name: company.name,
      },
    });
  } catch (error) {
    console.error("Error deleting company:", error.message);

    return res.status(500).json({
      message: "Internal server error while deleting company",
      success: false,
      error: error.message,
    });
  }
};
