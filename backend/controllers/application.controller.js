import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { CV } from "../models/cv.model.js";
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    const { cvId } = req.body;

    // ❗ Chỉ null mới là apply bằng profile
    const usingProfile = cvId === null;

    // ❗ Bắt FE gửi cvId không hợp lệ
    if (cvId === undefined || cvId === "") {
      return res.status(400).json({
        message: "cvId must be null (profile) or valid CV ID",
        success: false,
      });
    }

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    // Check double apply (đã đủ an toàn)
    const existing = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    let cv = null;

    // Nếu apply bằng CV — kiểm tra CV có thuộc user hay không
    if (!usingProfile) {
      cv = await CV.findById(cvId);
      if (!cv || cv.user.toString() !== userId) {
        return res.status(403).json({
          message: "Invalid CV selected.",
          success: false,
        });
      }
    }

    // Tạo application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      cv: usingProfile ? null : cvId,
      usedProfile: usingProfile,
    });

    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id },
    });

    return res.status(201).json({
      message: usingProfile
        ? "Applied using your profile!"
        : "Applied using selected CV!",
      success: true,
      application,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      res.status(404).json({
        message: "No Application",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
//admin get application for user
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "applicant",
          select: "-password -__v",
          populate: { path: "profile" },
        },
        {
          path: "cv",
        },
      ],
    });

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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }
    //find the application by applicant id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      res.status(400).json({
        message: "Application not found",
        success: false,
      });
    }

    //update the status
    application.status = status.toLowerCase();
    await application.save();

    res.status(200).json({
      message: "Status update successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
