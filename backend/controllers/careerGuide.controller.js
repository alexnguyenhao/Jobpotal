import { CareerGuide } from "../models/careerGuide.model.js";
import { User } from "../models/user.model.js";

// --- HELPER FUNCTIONS (Tiện ích hỗ trợ) ---

// 1. Chuyển Tiếng Việt có dấu thành Slug (VD: "Bí quyết xin việc" -> "bi-quyet-xin-viec")
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
    .replace(/[đĐ]/g, "d")
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w\-]+/g, "") // Bỏ ký tự đặc biệt
    .replace(/\-\-+/g, "-") // Thay nhiều dấu gạch ngang bằng 1 dấu
    .replace(/^-+/, "") // Cắt gạch ngang đầu
    .replace(/-+$/, ""); // Cắt gạch ngang cuối
};

// 2. Tính thời gian đọc (giả định 200 từ/phút)
const calculateReadingTime = (content) => {
  const text = content.replace(/<[^>]*>?/gm, ""); // Loại bỏ thẻ HTML để đếm từ chuẩn hơn
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
};

// 3. Tạo đoạn trích ngắn (Excerpt) từ Content nếu người dùng không nhập
const generateExcerpt = (content, maxLength = 150) => {
  const text = content.replace(/<[^>]*>?/gm, ""); // Bỏ HTML
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// --- MAIN CONTROLLERS ---

// CREATE – Recruiter đăng bài
export const createCareerGuide = async (req, res) => {
  try {
    const { title, thumbnail, content, tags, category, excerpt } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Xử lý dữ liệu tự động
    const slug = createSlug(title) + "-" + Date.now(); // Thêm timestamp để tránh trùng slug tuyệt đối
    const readingTime = calculateReadingTime(content);
    const finalExcerpt = excerpt || generateExcerpt(content); // Nếu ko nhập excerpt thì tự cắt

    const guide = await CareerGuide.create({
      title,
      slug,
      thumbnail,
      content,
      excerpt: finalExcerpt,
      readingTime,
      tags: tags || [],
      category: category || "job-search",
      author: req.id,
      company: req.company || null,
    });

    return res.status(201).json({
      success: true,
      message: "Career guide created successfully",
      guide,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET ALL – Student xem danh sách (Có tìm kiếm + Phân trang + Tối ưu data)
export const getAllCareerGuides = async (req, res) => {
  try {
    const { keyword, category, page = 1, limit = 10 } = req.query;

    // Xây dựng bộ lọc
    const query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (keyword) {
      // Tìm kiếm trong title hoặc tags (sử dụng regex không phân biệt hoa thường)
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ];
    }

    const guides = await CareerGuide.find(query)
      .select("-content") // QUAN TRỌNG: Không lấy nội dung full để nhẹ API
      .populate("author", "fullName profilePhoto")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await CareerGuide.countDocuments(query);

    return res.json({
      success: true,
      guides,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load guides",
      error: error.message,
    });
  }
};

// GET ONE – Xem chi tiết (Hỗ trợ tìm bằng ID hoặc SLUG)
export const getCareerGuideById = async (req, res) => {
  try {
    const { id } = req.params;

    let guide;
    // Kiểm tra xem id truyền vào là ObjectId hay Slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      guide = await CareerGuide.findById(id).populate(
        "author",
        "fullName profilePhoto"
      );
    } else {
      guide = await CareerGuide.findOne({ slug: id }).populate(
        "author",
        "fullName profilePhoto"
      );
    }

    if (!guide || !guide.isPublished) {
      return res
        .status(404)
        .json({ success: false, message: "Career guide not found" });
    }

    // Tăng view
    guide.views += 1;
    await guide.save();

    return res.json({ success: true, guide });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get guide",
      error: error.message,
    });
  }
};

// UPDATE – Recruiter chỉnh sửa bài viết
export const updateCareerGuide = async (req, res) => {
  try {
    const guide = await CareerGuide.findById(req.params.id);

    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
    }

    if (guide.author.toString() !== req.id) {
      return res
        .status(403)
        .json({ success: false, message: "No permission to edit this guide" });
    }

    const { title, content, excerpt, ...otherData } = req.body;

    // Logic cập nhật thông minh
    if (title && title !== guide.title) {
      guide.title = title;
      // Nếu đổi title, có thể đổi slug hoặc giữ nguyên tùy logic. Ở đây mình update luôn slug
      guide.slug = createSlug(title) + "-" + Date.now();
    }

    if (content) {
      guide.content = content;
      guide.readingTime = calculateReadingTime(content); // Tính lại thời gian đọc
      // Nếu người dùng không nhập excerpt mới, tự tạo lại excerpt từ content mới
      if (!excerpt) {
        guide.excerpt = generateExcerpt(content);
      }
    }

    if (excerpt) guide.excerpt = excerpt;

    // Cập nhật các trường còn lại
    Object.assign(guide, otherData);

    const updatedGuide = await guide.save();

    return res.json({ success: true, guide: updatedGuide });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update guide",
      error: error.message,
    });
  }
};

// DELETE – Recruiter xoá bài
export const deleteCareerGuide = async (req, res) => {
  try {
    const guide = await CareerGuide.findById(req.params.id);

    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
    }

    if (guide.author.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "No permission to delete this guide",
      });
    }

    await guide.deleteOne();

    return res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete guide",
      error: error.message,
    });
  }
};

// GET BY RECRUITER – Lấy danh sách bài đăng của chính recruiter
export const getCareerGuidesByRecruiter = async (req, res) => {
  try {
    if (req.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const guides = await CareerGuide.find({ author: req.id })
      .select("-content") // Tối ưu: Không lấy content nặng
      .populate("author", "fullName profilePhoto")
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    return res.json({ success: true, guides });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load recruiter guides",
      error: error.message,
    });
  }
};

// GET ONE (Recruiter View) - Giữ nguyên logic xem chi tiết để edit
export const getCareerGuideDetailsForRecruiter = async (req, res) => {
  try {
    // Logic này giữ nguyên vì cần lấy full content để fill vào form Edit
    const guide = await CareerGuide.findById(req.params.id);

    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
    }

    if (guide.author.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "No permission" });
    }

    return res.json({ success: true, guide });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error", error: error.message });
  }
};
