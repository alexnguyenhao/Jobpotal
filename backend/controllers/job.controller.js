import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../libs/send-email.js";
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
    });
    const studentUsers = await User.find({
      role: "student",
    }).select("email fullName");
    console.log("studentUsers:", studentUsers);
    for (const u of studentUsers) {
      await sendEmail(
        u.email,
        `New Job Posted: ${job.title}`,
        `
    <div style="font-family: Arial; padding: 10px;">
      <h2 style="color:#6A38C2;">New Job Posted</h2>
      <p>Hello ${u.fullName},</p>
      <p>A new job has been posted that may match your interest:</p>

      <h3>${job.title}</h3>
      <p><strong>Location:</strong> ${job.location.province}</p>

      <br/>
      <a 
        href="http://localhost:5173/description/${job._id}"
        style="
          display:inline-block; 
          padding:10px 15px; 
          background:#6A38C2; 
          color:white; 
          text-decoration:none; 
          border-radius:6px;"
      >
        View Job →
      </a>
    </div>
    `
      );
    }

    return res.status(201).json({
      message: "✅ New job posted & notifications sent!",
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

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: jobs.length,
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

    // 🔍 Keyword Search (title + description)
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
export const getJobsByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const jobs = await Job.find({ company: companyId })
      .populate("company category")
      .sort({ createdAt: -1 });
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
    const jobs = await Job.find({ category: categoryId })
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
