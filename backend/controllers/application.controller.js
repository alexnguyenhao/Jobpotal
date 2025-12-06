import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { CV } from "../models/cv.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { sendEmail } from "../libs/send-email.js";
import { applicantJobTemplate } from "../templates/applicantJobTemplate.js";
import { getReceiverSocketId, io } from "../socket.js";
import { jobApplicationSuccessTemplate } from "../templates/jobApplicationSuccessTemplate.js";
import { calculateApplicationScore } from "../utils/aiService.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    const { cvId, coverLetter } = req.body;

    if (!userId)
      return res
        .status(401)
        .json({ message: "Login required", success: false });
    if (!jobId)
      return res
        .status(400)
        .json({ message: "Job ID required", success: false });
    if (!cvId)
      return res
        .status(400)
        .json({ message: "CV is required", success: false });

    const job = await Job.findById(jobId).populate("company");
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const selectedCv = await CV.findById(cvId);
    if (!selectedCv)
      return res.status(404).json({ message: "CV not found", success: false });

    if (selectedCv.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Permission denied", success: false });
    }

    let cvSnapshotData = {};
    const cvType = selectedCv.type || "builder";

    if (cvType === "upload") {
      cvSnapshotData = {
        title: selectedCv.title,
        type: "upload",
        fileData: {
          url: selectedCv.fileData?.url || selectedCv.resume,
          publicId: selectedCv.fileData?.publicId,
          originalName:
            selectedCv.fileData?.originalName || selectedCv.resumeOriginalName,
          mimeType: selectedCv.fileData?.mimeType,
          size: selectedCv.fileData?.size,
        },
        personalInfo: {},
        education: [],
        workExperience: [],
        skills: [],
        projects: [],
      };
    } else {
      cvSnapshotData = {
        title: selectedCv.title,
        type: "builder",
        template: selectedCv.template,
        personalInfo: selectedCv.personalInfo,
        education: selectedCv.education,
        workExperience: selectedCv.workExperience,
        skills: selectedCv.skills,
        certifications: selectedCv.certifications,
        languages: selectedCv.languages,
        achievements: selectedCv.achievements,
        projects: selectedCv.projects,
        operations: selectedCv.operations,
        interests: selectedCv.interests,
        styleConfig: selectedCv.styleConfig,
      };
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
      cvId: cvId,
      cvSnapshot: cvSnapshotData,
      coverLetter: coverLetter || "",
      aiScore: null,
      aiFeedback: "",
      matchStatus: "Pending",
    });

    job.applications.push(application._id);
    await job.save();

    if (job.created_by) {
      const recruiterId = job.created_by;
      const notiMessage = `New application for ${job.title}`;
      const notification = await Notification.create({
        recipient: recruiterId,
        sender: userId,
        type: "new_application",
        message: notiMessage,
        relatedId: application._id,
      });
      const socketId = getReceiverSocketId(recruiterId.toString());
      if (socketId) io.to(socketId).emit("newNotification", notification);
    }

    const companyName = job.company?.name || "The Company";
    const jobTitle = job.title;
    const jobsPageUrl = `${process.env.FRONTEND_URL}/jobs`;
    const emailSubject = `Application Received: ${jobTitle}`;
    const emailHtml = jobApplicationSuccessTemplate(
      user.fullName,
      jobTitle,
      companyName,
      jobsPageUrl
    );

    sendEmail(user.email, emailSubject, emailHtml).catch((err) =>
      console.error(err)
    );

    return res.status(201).json({
      message: "Application submitted successfully!",
      success: true,
      application,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const analyzeApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId).populate(
      "job"
    );

    if (!application)
      return res.status(404).json({ message: "App not found", success: false });
    const aiResult = await calculateApplicationScore(
      application.cvSnapshot,
      application.job.description,
      application.job.requirements || []
    );

    application.aiScore = aiResult.aiScore;
    application.aiFeedback = aiResult.aiFeedback;
    application.matchStatus = aiResult.matchStatus;
    await application.save();

    return res.status(200).json({ success: true, data: aiResult });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "AI Analysis failed", success: false });
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

    return res.status(200).json({
      application: application || [],
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch applied jobs",
      success: false,
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "applicant",
          select: "-password",
          populate: { path: "profile" },
        },
        {
          path: "cvId",
          select: "title",
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
      const notiMessage = `Your application for ${jobTitle} has been ${status.toLowerCase()}.`;

      const notification = await Notification.create({
        recipient: student._id,
        sender: req.id,
        type: "application_status",
        message: notiMessage,
        relatedId: application._id,
        isRead: false,
      });

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
export const getApplicationById = async (req, res) => {
  try {
    const id = req.params.id;
    const application = await Application.findById(id)
      .populate({
        path: "applicant",
        select: "-password",
        populate: { path: "profile" },
      })
      .populate({ path: "cvId" });

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
