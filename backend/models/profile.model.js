import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔗 liên kết ngược lại với User
      required: true,
      unique: true,
    },
    title: { type: String },
    skills: [{ type: String }],
    careerObjective: { type: String },
    workExperience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },

        description: { type: String, required: true },
      },
    ],

    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        major: { type: String, required: true },
        startDate: { type: String },
        endDate: { type: String },
      },
    ],

    certifications: [
      {
        name: { type: String, required: true },
        organization: { type: String, required: true },
        dateIssued: { type: Date, required: true },
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
        title: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String, required: true },
        technologies: [{ type: String, default: [] }],
      },
    ],

    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        year: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
