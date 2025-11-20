import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { CV } from "../models/cv.model.js";
import { User } from "../models/user.model.js"; // Import thêm nếu cần check profile
import { Notification } from "../models/notification.model.js";
import { sendEmail } from "../libs/send-email.js";
import { applicantJobTemplate } from "../templates/applicantJobTemplate.js";
import { getReceiverSocketId } from "../socket.js";

// 1. APPLY JOB
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(401).json({
        message: "You must login to apply for a job",
        success: false,
      });
    }

    const jobId = req.params.id;
    const { cvId } = req.body;

    // Validate Input
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    // Kiểm tra Job có tồn tại không
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const usingProfile = cvId === null;

    if (!usingProfile && !cvId) {
      return res.status(400).json({
        message: "Please select a CV or choose to apply with Profile",
        success: false,
      });
    }

    // Kiểm tra đã apply chưa
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
    if (!usingProfile) {
      const cv = await CV.findById(cvId);
      if (!cv || cv.user.toString() !== userId) {
        return res.status(403).json({
          message: "Invalid CV selected or access denied.",
          success: false,
        });
      }
    } else {
      const user = await User.findById(userId);
      if (!user.resume) {
        return res.status(400).json({
          message:
            "Your profile does not have a resume yet. Please upload one in settings.",
          success: false,
        });
      }
    }

    // Tạo Application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      cv: usingProfile ? null : cvId,
      usedProfile: usingProfile,
    });

    // Push application vào Job
    job.applications.push(application._id);
    await job.save();

    return res.status(201).json({
      message: "Application submitted successfully!",
      success: true,
      application,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// 2. GET APPLIED JOBS (Student xem lịch sử)
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

    // Note: .find() trả về mảng rỗng [] nếu ko có, chứ ko phải null/undefined
    if (!application || application.length === 0) {
      return res.status(200).json({
        // Trả về 200 OK với mảng rỗng là chuẩn hơn 404
        message: "You haven't applied to any jobs yet.",
        application: [],
        success: true,
      });
    }

    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      // ❗ Phải return response lỗi
      message: "Failed to fetch applied jobs",
      success: false,
    });
  }
};

// 3. GET APPLICANTS (Recruiter xem ứng viên của 1 Job)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "applicant",
          select: "-password", // Bỏ field password
          populate: { path: "profile" },
        },
        {
          path: "cv", // Populate thêm CV nếu user dùng custom CV
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
    console.error(error);
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
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }
    const application = await Application.findOne({ _id: applicationId })
      .populate("applicant")
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }
    application.status = status.toLowerCase();
    await application.save();
    if (application.applicant) {
      const student = application.applicant;
      const jobData = application.job;
      const jobTitle = jobData?.title || "Unknown Job";
      const companyName = jobData?.company?.name || "Career Support";

      // A. Tạo Notification (DB)
      const notiMessage = `Your application for ${jobTitle} has been ${status.toLowerCase()}.`;

      const notification = await Notification.create({
        recipient: student._id,
        sender: req.id,
        type: "application_status",
        message: notiMessage,
        relatedId: application._id,
        isRead: false,
      });

      // B. Gửi Socket Real-time
      const receiverSocketId = getReceiverSocketId(student._id.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
      }
      if (["accepted", "rejected"].includes(status.toLowerCase())) {
        const emailHtml = applicantJobTemplate(
          student.fullName,
          jobTitle,
          status,
          companyName
        );

        const emailSubject = `Update on your application for ${jobTitle}`;
        sendEmail(student.email, emailSubject, emailHtml);
      }
    }

    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update status",
      success: false,
    });
  }
};
