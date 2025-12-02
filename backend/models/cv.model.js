import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true, default: "Untitled CV" },
    type: {
      type: String,
      enum: ["builder", "upload"],
      required: true,
      default: "builder",
    },

    fileData: {
      url: { type: String },
      publicId: { type: String },
      originalName: { type: String },
      mimeType: { type: String },
      size: { type: Number },
    },

    template: {
      type: String,
      enum: ["modern", "classic", "creative"],
      default: "modern",
    },

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
        isCurrent: { type: Boolean, default: false },
        description: String,
      },
    ],

    workExperience: [
      {
        position: String,
        company: String,
        startDate: Date,
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
        description: String,
      },
    ],

    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          default: "Intermediate",
        },
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
        proficiency: {
          type: String,
          enum: ["Basic", "Conversational", "Fluent", "Native"],
          default: "Basic",
        },
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
      fontFamily: { type: String, default: "font-sans" },
      fontSizeClass: { type: String, default: "text-base" },
      primaryColor: { type: String, default: "#4D6CFF" },
      backgroundColor: { type: String, default: "#ffffff" },
      textColor: { type: String, default: "#111" },
      spacing: { type: String, default: "normal" },
      borderRadius: { type: Number, default: 12 },
      shadowLevel: { type: Number, default: 1 },
    },

    isPublic: { type: Boolean, default: false },
    shareUrl: { type: String, default: "" },
  },

  { timestamps: true }
);

export const CV = mongoose.model("CV", cvSchema);
