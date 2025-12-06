import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Profile } from "../models/profile.model.js";
import { analyzeJobFitForStudent } from "../utils/aiService.js";
// Import hàm lấy tọa độ từ Goong Map
import { getCoordinates } from "../utils/goongMap.js";

// file: job.controller.js

export const postJob = async (req, res) => {
  try {
    // 1. Lấy dữ liệu từ req.body (Cấu trúc khớp với Frontend gửi lên)
    const {
      title,
      professional,
      description,
      requirements,
      benefits,
      salary, // Frontend gửi object { min, max, currency, isNegotiable }
      location, // Frontend gửi object { province, district, ward, address }
      jobType,
      experienceLevel, // Frontend gửi experienceLevel
      numberOfPositions, // Frontend gửi numberOfPositions
      company,
      category,
      seniorityLevel,
      applicationDeadline,
    } = req.body;

    const userId = req.id;

    // 2. Validate dữ liệu (Sửa lại logic check)
    if (
      !title ||
      !professional?.length ||
      !description ||
      !salary?.min || // Check trong object salary
      !salary?.max ||
      !location?.province || // Check trong object location
      !location?.district ||
      !location?.address ||
      !jobType?.length ||
      !experienceLevel || // Check experienceLevel
      !numberOfPositions || // Check numberOfPositions
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

    // 3. Kiểm tra Company
    const companyInfo = await Company.findById(company);
    if (!companyInfo) {
      return res
        .status(404)
        .json({ message: "Company not found.", success: false });
    }
    if (!companyInfo.isVerified) {
      return res
        .status(403)
        .json({ message: "Company is not verified.", success: false });
    }
    if (["banned", "inactive"].includes(companyInfo.status)) {
      return res
        .status(403)
        .json({ message: "Company is banned or inactive.", success: false });
    }

    // 4. Xử lý Requirements & Benefits (Frontend đã xử lý thành mảng, nhưng check lại cho chắc)
    // Nếu Frontend gửi mảng rồi thì dùng luôn, nếu là string thì split
    const formattedRequirements = Array.isArray(requirements)
      ? requirements
      : typeof requirements === "string"
      ? requirements
          .split(/[•\-–\.]/)
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    const formattedBenefits = Array.isArray(benefits)
      ? benefits
      : typeof benefits === "string"
      ? benefits
          .split(/\n|^-\s*/gm)
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    // 5. --- XỬ LÝ TỌA ĐỘ (GOONG MAP) ---
    // Lấy dữ liệu từ object location
    const fullAddress = `${location.address}, ${location.ward || ""}, ${
      location.district
    }, ${location.province}`;

    const coords = await getCoordinates(fullAddress);

    // Cập nhật lại location với tọa độ
    const locationData = {
      ...location,
      coords: {
        type: "Point",
        coordinates: coords ? [coords.lng, coords.lat] : [0, 0],
      },
    };

    // 6. Tạo Job
    const job = await Job.create({
      title,
      professional,
      description,
      requirements: formattedRequirements,
      benefits: formattedBenefits,
      salary, // Lưu nguyên object salary
      location: locationData, // Lưu object location đã xử lý
      experienceLevel, // Dùng đúng tên trường trong Schema
      seniorityLevel,
      jobType,
      numberOfPositions, // Dùng đúng tên trường trong Schema
      company,
      category,
      applicationDeadline: new Date(applicationDeadline),
      created_by: userId,
      status: "Open",
    });

    return res.status(201).json({
      message: "✅ New job posted successfully!",
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

// file: job.controller.js

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    // req.body có thể chứa cấu trúc lồng nhau (location, salary) giống PostJob
    const updates = req.body;

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID is required" });
    }

    const jobCheck = await Job.findById(jobId);
    if (!jobCheck) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Kiểm tra quyền sở hữu
    if (jobCheck.created_by.toString() !== req.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this job",
      });
    }

    // --- 1. XỬ LÝ LOCATION & TỌA ĐỘ ---
    // Ưu tiên lấy từ object updates.location, nếu không thì tìm các biến phẳng (fallback)
    const incomingLocation = updates.location || {};
    const newProvince = incomingLocation.province || updates.province;
    const newDistrict = incomingLocation.district || updates.district;
    const newWard = incomingLocation.ward || updates.ward;
    const newAddress = incomingLocation.address || updates.address;

    // Lấy dữ liệu cũ để so sánh
    let locationUpdate = { ...jobCheck.location.toObject() };
    let isAddressChanged = false;

    // Kiểm tra từng trường xem có thay đổi không
    if (newProvince && newProvince !== locationUpdate.province) {
      locationUpdate.province = newProvince;
      isAddressChanged = true;
    }
    if (newDistrict && newDistrict !== locationUpdate.district) {
      locationUpdate.district = newDistrict;
      isAddressChanged = true;
    }
    if (newWard && newWard !== locationUpdate.ward) {
      locationUpdate.ward = newWard;
      isAddressChanged = true;
    }
    if (newAddress && newAddress !== locationUpdate.address) {
      locationUpdate.address = newAddress;
      isAddressChanged = true;
    }

    // Nếu địa chỉ đổi, gọi API lấy lại tọa độ
    if (isAddressChanged) {
      const fullAddress = `${locationUpdate.address}, ${
        locationUpdate.ward || ""
      }, ${locationUpdate.district}, ${locationUpdate.province}`;

      const newCoords = await getCoordinates(fullAddress);

      if (newCoords) {
        locationUpdate.coords = {
          type: "Point",
          coordinates: [newCoords.lng, newCoords.lat],
        };
      } else {
        // Nếu không tìm thấy tọa độ, có thể set về mặc định hoặc giữ nguyên
        // Ở đây set về [0,0] để tránh lỗi dữ liệu cũ không khớp
        locationUpdate.coords = { type: "Point", coordinates: [0, 0] };
      }
    }

    // Gán lại location đã xử lý vào updates
    updates.location = locationUpdate;

    // --- 2. XỬ LÝ SALARY ---
    // Tương tự, ưu tiên object updates.salary
    const incomingSalary = updates.salary || {};
    const oldSalary = jobCheck.salary || {};

    // Merge dữ liệu lương mới vào cũ
    updates.salary = {
      min:
        incomingSalary.min !== undefined
          ? Number(incomingSalary.min)
          : updates.salaryMin
          ? Number(updates.salaryMin)
          : oldSalary.min,
      max:
        incomingSalary.max !== undefined
          ? Number(incomingSalary.max)
          : updates.salaryMax
          ? Number(updates.salaryMax)
          : oldSalary.max,
      currency:
        incomingSalary.currency ||
        updates.currency ||
        oldSalary.currency ||
        "VND",
      isNegotiable:
        incomingSalary.isNegotiable !== undefined
          ? incomingSalary.isNegotiable
          : updates.isNegotiable !== undefined
          ? updates.isNegotiable
          : oldSalary.isNegotiable,
    };

    // --- 3. XỬ LÝ CÁC MẢNG (Requirements, Benefits, Professional) ---
    // Kiểm tra nếu là string thì split, nếu là array rồi thì giữ nguyên

    // Professional
    if (updates.professional) {
      if (typeof updates.professional === "string") {
        updates.professional = updates.professional
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      }
    }

    // Requirements
    if (updates.requirements) {
      if (typeof updates.requirements === "string") {
        updates.requirements = updates.requirements
          .split(/[•\-–\.]/)
          .map((i) => i.trim())
          .filter(Boolean);
      }
    }

    // Benefits
    if (updates.benefits) {
      if (typeof updates.benefits === "string") {
        updates.benefits = updates.benefits
          .split(/\n|^-\s*/gm)
          .map((i) => i.trim())
          .filter(Boolean);
      }
    }

    // Xóa các trường phẳng thừa để sạch payload trước khi update
    delete updates.province;
    delete updates.district;
    delete updates.ward;
    delete updates.address;
    delete updates.salaryMin;
    delete updates.salaryMax;

    const job = await Job.findByIdAndUpdate(jobId, updates, {
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

// --- CÁC HÀM DƯỚI ĐÂY GIỮ NGUYÊN HOẶC CHỈNH SỬA NHỎ ĐỂ KHỚP DATA ---

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
      location, // Frontend gửi tên Tỉnh (VD: "Hồ Chí Minh")
      jobType,
      experience,
      seniorityLevel,
      salaryMin,
      salaryMax,
    } = req.query;

    const query = { status: "Open" }; // Chỉ tìm job đang mở

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        // Thêm tìm kiếm theo tên đường/quận
        { "location.address": { $regex: keyword, $options: "i" } },
        { "location.district": { $regex: keyword, $options: "i" } },
      ];
    }

    if (company) query.company = company;
    if (category) query.category = category;

    // Logic tìm theo tỉnh thành (Do cấu trúc mới là location.province)
    if (location)
      query["location.province"] = { $regex: location, $options: "i" };

    if (jobType) query.jobType = jobType;
    if (experience)
      query.experienceLevel = { $regex: experience, $options: "i" };
    if (seniorityLevel) query.seniorityLevel = seniorityLevel;

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
        message: "You need to update your profile to use this feature.",
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
      Location: ${job.location.address}, ${job.location.district}, ${job.location.province}
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
