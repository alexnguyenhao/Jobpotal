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
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
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
