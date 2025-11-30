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
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CV",
      default: null,
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
