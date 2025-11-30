import mongoose from "mongoose";

const careerGuideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    excerpt: {
      type: String,
      maxLength: 300,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "job-search",
        "interview-tips",
        "career-development",
        "industry-insights",
        "workplace-skills",
        "resume-writing",
        "others",
      ],
      default: "job-search",
      index: true,
    },
    content: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    tags: [{ type: String }],

    views: {
      type: Number,
      default: 0,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    readingTime: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

careerGuideSchema.index({ title: "text", content: "text", tags: "text" });

export const CareerGuide = mongoose.model("CareerGuide", careerGuideSchema);
