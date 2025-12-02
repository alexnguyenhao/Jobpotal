import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    coverLetter: {
      type: String,
      trim: true,
      maxLength: [5000, "Cover letter cannot exceed 5000 characters"],
      default: "",
    },
    cvId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CV",
      required: true,
    },
    cvSnapshot: {
      title: { type: String },
      type: {
        type: String,
        enum: ["builder", "upload"],
        required: true,
      },
      fileData: {
        url: String,
        publicId: String,
        originalName: String,
        mimeType: String,
        size: Number,
      },
      template: { type: String },
      personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        dateOfBirth: Date,
        gender: String,
        profilePhoto: String,
        position: String,
        summary: String,
      },
      education: [
        {
          school: String,
          degree: String,
          major: String,
          startDate: Date,
          endDate: Date,
          isCurrent: Boolean,
          description: String,
        },
      ],
      workExperience: [
        {
          position: String,
          company: String,
          startDate: Date,
          endDate: Date,
          isCurrent: Boolean,
          description: String,
        },
      ],
      skills: [
        {
          name: String,
          level: String,
        },
      ],
      certifications: [
        {
          name: String,
          organization: String,
          dateIssued: Date,
          expirationDate: Date,
          url: String,
        },
      ],
      languages: [
        {
          language: String,
          proficiency: String,
        },
      ],
      achievements: [
        {
          title: String,
          description: String,
          date: Date,
        },
      ],
      projects: [
        {
          title: String,
          description: String,
          link: String,
          technologies: [String],
          startDate: Date,
          endDate: Date,
          isWorking: Boolean,
        },
      ],
      operations: [
        {
          title: String,
          position: String,
          description: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      interests: { type: String },
      styleConfig: {
        fontFamily: String,
        fontSizeClass: String,
        primaryColor: String,
        backgroundColor: String,
        textColor: String,
        spacing: String,
        borderRadius: Number,
        shadowLevel: Number,
      },
    },
    aiScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    aiFeedback: {
      type: String,
      default: "",
    },
    matchStatus: {
      type: String,
      enum: ["Pending", "High", "Medium", "Low", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
