import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    benefits: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: [
        "Intern",
        "Junior",
        "Mid",
        "Senior",
        "Lead",
        "Manager",
        "Director",
        "Executive",
      ],
      required: true,
    },
    jobType: {
      type: [String],
      enum: ["Full-time", "Part-time", "Remote", "Contract", "Internship"],
      required: true,
    },
    numberOfPositions: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Open",
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);
export const Job = mongoose.model("Job", JobSchema);
