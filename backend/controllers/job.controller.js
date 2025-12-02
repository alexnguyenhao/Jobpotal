import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Profile } from "../models/profile.model.js";
import { analyzeJobFitForStudent } from "../utils/aiService.js";
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      benefits,
      salaryMin,
      salaryMax,
      currency,
      isNegotiable,
      province,
      district,
      address,
      jobType,
      experience,
      position,
      company,
      category,
      seniorityLevel,
      applicationDeadline,
      status,
    } = req.body;

    const userId = req.id;
    if (!title || !description || !company || !province) {
      return res.status(400).json({
        message: "Missing required fields.",
        success: false,
      });
    }
    const companyInfo = await Company.findById(company);

    if (!companyInfo) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    if (!companyInfo.isVerified) {
      return res.status(403).json({
        message: "Company is not verified.",
        success: false,
      });
    }

    if (companyInfo.status === "banned" || companyInfo.status === "inactive") {
      return res.status(403).json({
        message: "Company is banned or inactive.",
        success: false,
      });
    }
    if (
      !title ||
      !description ||
      !salaryMin ||
      !salaryMax ||
      !province ||
      !jobType?.length ||
      !experience ||
      !position ||
      !company ||
      !category ||
      !seniorityLevel ||
      !applicationDeadline
    ) {
      return res.status(400).json({
        message: "Missing required fields.",
        success: false,
      });
    }

    const formattedRequirements =
      typeof requirements === "string"
        ? requirements
            .split(/[•\-–\.]/)
            .map((i) => i.trim())
            .filter(Boolean)
        : requirements;

    const formattedBenefits =
      typeof benefits === "string"
        ? benefits
            .split(/\n|^-\s*/gm)
            .map((i) => i.trim())
            .filter(Boolean)
        : benefits;

    const job = await Job.create({
      title,
      description,
      requirements: formattedRequirements,
      benefits: formattedBenefits,
      salary: {
        min: Number(salaryMin),
        max: Number(salaryMax),
        currency: currency || "VND",
        isNegotiable: isNegotiable || false,
      },
      location: {
        province,
        district: district || "",
        address: address || "",
      },
      experienceLevel: experience,
      seniorityLevel,
      jobType,
      numberOfPositions: position,
      company,
      category,
      applicationDeadline: new Date(applicationDeadline),
      created_by: userId,
      status: "Open",
    });

    return res.status(201).json({
      message: "✅ New job posted!",
      success: true,
      job,
    });
  } catch (err) {
    console.error(" Post Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" })
      .populate("company category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("Get All Jobs Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const {
      keyword,
      company,
      category,
      location,
      jobType,
      experience,
      seniorityLevel,
      salaryMin,
      salaryMax,
    } = req.query;

    const query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (company) query.company = company;
    if (category) query.category = category;
    if (location) query["location.province"] = location;
    if (jobType) query.jobType = jobType;
    if (experience)
      query.experienceLevel = { $regex: experience, $options: "i" };
    if (seniorityLevel) query.seniorityLevel = seniorityLevel;

    // 💰 Salary range
    if (salaryMin || salaryMax) {
      query.$and = [];
      if (salaryMin)
        query.$and.push({ "salary.min": { $gte: Number(salaryMin) } });
      if (salaryMax)
        query.$and.push({ "salary.max": { $lte: Number(salaryMax) } });
    }

    const jobs = await Job.find(query)
      .populate("company category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("❌ Search Jobs Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("applications")
      .populate("company")
      .populate("category");

    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    return res.status(200).json({ job, success: true });
  } catch (err) {
    console.error("❌ Get Job By ID Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getJobFitAnalysis = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        message: "You need to login to use this feature.",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    const userProfile = await Profile.findOne({ user: userId });
    if (!userProfile) {
      return res.status(400).json({
        message:
          "You need to update your profile (Profile) to use this feature.",
        success: false,
      });
    }

    const requirementsText = Array.isArray(job.requirements)
      ? job.requirements.join(", ")
      : job.requirements;

    const fullJobContext = `
      Job Title: ${job.title}
      Description: ${job.description}
      Requirements: ${requirementsText}
      Experience Level: ${job.experienceLevel}
    `;
    const aiAnalysis = await analyzeJobFitForStudent(
      userProfile,
      fullJobContext
    );

    return res.status(200).json({
      success: true,
      aiAnalysis,
    });
  } catch (err) {
    console.error("❌ Get Job Fit Analysis Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate("company category")
      .populate("applications")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs, success: true });
  } catch (err) {
    console.error("❌ Get Admin Jobs Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate ID
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const jobCheck = await Job.findById(jobId);

    if (!jobCheck) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (jobCheck.created_by.toString() !== req.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this job",
      });
    }

    const job = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    console.error("❌ Update Job Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const jobCheck = await Job.findById(jobId);

    if (!jobCheck) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (jobCheck.created_by.toString() !== req.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this job",
      });
    }

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete Job Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getJobsByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const limit = 100;

    const jobs = await Job.find({ company: companyId, status: "Open" })
      .populate("company category", "name logo _id")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("❌ Get Jobs By Company Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getJobsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const jobs = await Job.find({ category: categoryId, status: "Open" })
      .populate("company category")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("❌ Get Jobs By Category Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
