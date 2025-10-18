import { Job } from "../models/job.model.js";

// ADMIN - Post a new job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      benefits,
      salary,
      location,
      jobType,
      experience,
      position,
      company,
      category,
      seniorityLevel,
      applicationDeadline, // 🆕 deadline từ FE gửi lên
    } = req.body;

    const userId = req.id;

    // Validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !benefits ||
      !salary ||
      !location ||
      !Array.isArray(jobType) ||
      jobType.length === 0 ||
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

    // Format requirements nếu là chuỗi
    const formattedRequirements =
      typeof requirements === "string"
        ? requirements
            .split(".")
            .map((item) => item.trim())
            .filter((i) => i)
        : requirements;
    const formatBenefits = (benefits) =>
      typeof benefits === "string"
        ? benefits
            .split(/\n|^-\s*/gm) // tách theo dòng mới hoặc dấu gạch đầu dòng đầu dòng
            .map((item) => item.trim())
            .filter((i) => i.length > 0)
        : benefits;

    const job = await Job.create({
      title,
      description,
      requirements: formattedRequirements,
      benefits: formatBenefits(benefits), // ✅ gọi hàm đúng cách
      salary,
      experienceLevel: experience,
      seniorityLevel,
      location,
      jobType,
      numberOfPositions: position,
      company,
      category,
      applicationDeadline: new Date(applicationDeadline),
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully",
      success: true,
    });
  } catch (err) {
    console.log("Post Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// STUDENT - Get all jobs (with optional keyword)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (err) {
    console.log("Get All Jobs Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// STUDENT - Get job by ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("applications")
      .populate("company")
      .populate("category");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (err) {
    console.log("Get Job By ID Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ADMIN - Get jobs created by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (err) {
    console.log("Get Admin Jobs Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
