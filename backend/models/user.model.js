import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    twoFAOtp: {
      type: String,
      default: null,
    },
    twoFAOtpExpires: {
      type: Date,
      default: null,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },

    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String },
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
      careerObjective: { type: String },
      workExperience: [
        {
          company: { type: String },
          position: { type: String },
          startDate: { type: Date },
          endDate: { type: Date },
          description: { type: String },
        },
      ],
      education: [
        {
          school: { type: String },
          degree: { type: String },
          major: { type: String },
          startYear: { type: Number },
          endYear: { type: Number },
        },
      ],
      certifications: [
        {
          name: { type: String },
          organization: { type: String },
          dateIssued: { type: Date },
        },
      ],
      languages: [
        {
          language: { type: String },
          proficiency: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "Fluent"],
          },
        },
      ],
      projects: [
        {
          title: { type: String },
          description: { type: String },
          link: { type: String },
          technologies: [{ type: String }],
        },
      ],
      achievements: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
