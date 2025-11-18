import mongoose from "mongoose";

const careerGuideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Tối ưu tìm kiếm theo tên
    },
    // URL thân thiện: vi-du-ve-tieu-de
    slug: {
      type: String,
      required: true,
      unique: true, // Bắt buộc duy nhất
      index: true, // Tối ưu query
    },
    thumbnail: {
      type: String,
      default: "",
    },
    // Mô tả ngắn để hiện ở danh sách bài viết (tránh load full content)
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
      index: true, // Tối ưu khi filter theo category
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

    tags: [{ type: String }], // Có thể đánh index text ở dưới nếu cần search fulltext

    // Thống kê & Tương tác
    views: {
      type: Number,
      default: 0,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Mảng user đã like (tùy chọn)

    // UX features
    readingTime: {
      type: Number, // Tính bằng phút (ví dụ: 5 phút)
      default: 0,
    },

    // Trạng thái & Quản lý
    isPublished: {
      type: Boolean,
      default: true,
      index: true, // Để lọc nhanh các bài đã public
    },
    isFeatured: {
      // Ghim bài viết lên đầu/banner
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

// Tạo Text Index để hỗ trợ chức năng tìm kiếm bài viết
careerGuideSchema.index({ title: "text", content: "text", tags: "text" });

export const CareerGuide = mongoose.model("CareerGuide", careerGuideSchema);
