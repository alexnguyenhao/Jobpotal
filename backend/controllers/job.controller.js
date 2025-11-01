import { Job } from "../models/job.model.js";

// ===============================
// 🟢 ADMIN - Post a new job
// ===============================
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
    } = req.body;

    const userId = req.id;

    // ====== Validation ======
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

    // ====== Normalize requirements & benefits ======
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

    // ====== Create new job ======
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
    });

    return res.status(201).json({
      message: "✅ New job created successfully",
      success: true,
      job,
    });
  } catch (err) {
    console.error("❌ Post Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ===============================
// 🔵 STUDENT - Get all jobs (with filter)
// ===============================
export const getAllJobs = async (req, res) => {
  try {
    const { keyword, province, minSalary, maxSalary } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (province) query["location.province"] = province;
    if (minSalary) query["salary.min"] = { $gte: Number(minSalary) };
    if (maxSalary) query["salary.max"] = { $lte: Number(maxSalary) };

    const jobs = await Job.find(query)
      .populate("company category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.error("❌ Get All Jobs Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ===============================
// 🔵 STUDENT - Get job by ID
// ===============================
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

// ===============================
// 🟡 ADMIN - Get jobs by admin
// ===============================
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate("company category")
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

// ===============================
// 🟠 ADMIN - Update job
// ===============================
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    return res.status(200).json({
      message: "Job updated successfully",
      success: true,
      job,
    });
  } catch (err) {
    console.error("❌ Update Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ===============================
// 🔴 ADMIN - Delete job
// ===============================
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("❌ Delete Job Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
