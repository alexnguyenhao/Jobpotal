import { CareerGuide } from "../models/careerGuide.model.js";

// --- HELPERS ---
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const calculateReadingTime = (content) => {
  const text = content.replace(/<[^>]*>?/gm, "");
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
};

const generateExcerpt = (content, maxLength = 150) => {
  const text = content.replace(/<[^>]*>?/gm, "");
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const createCareerGuide = async (req, res) => {
  try {
    const { title, thumbnail, content, tags, category, excerpt, isPublished } =
      req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const slug = createSlug(title) + "-" + Date.now();
    const readingTime = calculateReadingTime(content);
    const finalExcerpt = excerpt || generateExcerpt(content);

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
      company: null,
      isPublished: isPublished || false,
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

export const getAllCareerGuides = async (req, res) => {
  try {
    const { keyword, category, page = 1, limit = 10 } = req.query;

    const query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ];
    }

    const guides = await CareerGuide.find(query)
      .select("-content")
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

export const getAllCareerGuidesAdmin = async (req, res) => {
  try {
    const guides = await CareerGuide.find()
      .select("-content")
      .populate("author", "fullName profilePhoto")
      .sort({ createdAt: -1 });

    return res.json({ success: true, guides });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin guides",
      error: error.message,
    });
  }
};

export const getCareerGuideById = async (req, res) => {
  try {
    const { id } = req.params;
    let guide;

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

export const getCareerGuideByIdAdmin = async (req, res) => {
  try {
    const guide = await CareerGuide.findById(req.params.id).populate(
      "author",
      "fullName profilePhoto"
    );

    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
    }

    return res.json({ success: true, guide });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error", error: error.message });
  }
};

export const updateCareerGuide = async (req, res) => {
  try {
    const guide = await CareerGuide.findById(req.params.id);

    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
    }

    const { title, content, excerpt, ...otherData } = req.body;

    if (title && title !== guide.title) {
      guide.title = title;
      guide.slug = createSlug(title) + "-" + Date.now();
    }

    if (content) {
      guide.content = content;
      guide.readingTime = calculateReadingTime(content);
      if (!excerpt) {
        guide.excerpt = generateExcerpt(content);
      }
    }

    if (excerpt) guide.excerpt = excerpt;

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

export const deleteCareerGuide = async (req, res) => {
  try {
    const guide = await CareerGuide.findById(req.params.id);

    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
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
