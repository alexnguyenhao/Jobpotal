import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParseLib = require("pdf-parse");

dotenv.config();

// Khởi tạo Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 1. UTILS: PDF PARSER ---
const parsePdfFromUrl = async (pdfUrl) => {
  try {
    if (!pdfUrl) return "";
    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const pdfBuffer = Buffer.from(response.data);
    let pdfParser;
    if (typeof pdfParseLib === "function") {
      pdfParser = pdfParseLib;
    } else if (
      pdfParseLib.default &&
      typeof pdfParseLib.default === "function"
    ) {
      pdfParser = pdfParseLib.default;
    } else {
      return "";
    }

    const data = await pdfParser(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error.message);
    return "";
  }
};

// --- 2. UTILS: FORMATTERS ---

// Format cho CV Snapshot (Dùng cho Recruitment Score)
const convertCvObjectToText = (cvData) => {
  try {
    if (!cvData) return "";
    const personal = cvData.personalInfo || {};
    const skills = cvData.skills || [];
    const education = cvData.education || [];
    const experience = cvData.workExperience || [];
    const projects = cvData.projects || [];

    let text = `CANDIDATE NAME: ${personal.fullName || "N/A"}\n`;
    text += `SUMMARY: ${personal.summary || "N/A"}\n\n`;

    text += `SKILLS: ${
      Array.isArray(skills)
        ? skills.map((s) => (typeof s === "object" ? s.name : s)).join(", ")
        : skills
    }\n\n`;

    text += `EXPERIENCE:\n`;
    experience.forEach((exp) => {
      const start = exp.startDate
        ? new Date(exp.startDate).getFullYear()
        : "N/A";
      const end = exp.endDate ? new Date(exp.endDate).getFullYear() : "Present";
      text += `- ${exp.position} at ${exp.company} (${start} - ${end}): ${
        exp.description || ""
      }\n`;
    });

    text += `\nEDUCATION:\n`;
    education.forEach((edu) => {
      text += `- ${edu.degree} in ${edu.major} at ${edu.school}\n`;
    });

    text += `\nPROJECTS:\n`;
    projects.forEach((proj) => {
      text += `- ${proj.title}: ${proj.description || ""} (Tech: ${
        proj.technologies?.join(", ") || "N/A"
      })\n`;
    });

    return text;
  } catch (error) {
    return "";
  }
};

// Format cho Full Student Profile (Dùng cho Career Advice) - ĐẦY ĐỦ NHẤT
const formatProfileForAI = (profileData) => {
  try {
    if (!profileData) return "";

    const data = profileData.toObject ? profileData.toObject() : profileData;
    const bio = data.bio || "";

    // 1. Thông tin cơ bản
    let text = `--- CANDIDATE PROFILE ---\n`;
    text += `TITLE: ${data.title || "N/A"}\n`;
    text += `BIO: ${bio}\n`;
    text += `OBJECTIVE: ${data.careerObjective || "N/A"}\n`;

    // 2. Kỹ năng
    text += `\nSKILLS:\n`;
    if (data.skills && Array.isArray(data.skills)) {
      text += data.skills
        .map((s) => `- ${s.name} (${s.level || "Intermediate"})`)
        .join("\n");
    }

    // 3. Kinh nghiệm làm việc
    text += `\nWORK EXPERIENCE:\n`;
    if (data.workExperience && Array.isArray(data.workExperience)) {
      data.workExperience.forEach((exp) => {
        const start = exp.startDate
          ? new Date(exp.startDate).getFullYear()
          : "N/A";
        const end = exp.isCurrent
          ? "Present"
          : exp.endDate
          ? new Date(exp.endDate).getFullYear()
          : "N/A";
        text += `- ${exp.position} at ${exp.company} (${start} - ${end})\n`;
        if (exp.description) text += `  Desc: ${exp.description}\n`;
      });
    }

    // 4. Dự án
    text += `\nPROJECTS:\n`;
    if (data.projects && Array.isArray(data.projects)) {
      data.projects.forEach((proj) => {
        text += `- ${proj.title}: ${proj.description || ""}\n`;
        if (proj.technologies && proj.technologies.length > 0) {
          text += `  Tech Stack: ${proj.technologies.join(", ")}\n`;
        }
      });
    }

    // 5. Học vấn
    text += `\nEDUCATION:\n`;
    if (data.education && Array.isArray(data.education)) {
      data.education.forEach((edu) => {
        text += `- ${edu.degree || "Degree"} in ${edu.major || "Major"} at ${
          edu.school
        }\n`;
      });
    }

    // 6. Ngôn ngữ
    if (data.languages && Array.isArray(data.languages)) {
      text += `\nLANGUAGES: ${data.languages
        .map((l) => `${l.language} (${l.proficiency})`)
        .join(", ")}\n`;
    }

    // 7. Chứng chỉ (Certifications)
    if (
      data.certifications &&
      Array.isArray(data.certifications) &&
      data.certifications.length > 0
    ) {
      text += `\nCERTIFICATIONS:\n`;
      data.certifications.forEach((cert) => {
        const date = cert.dateIssued
          ? new Date(cert.dateIssued).getFullYear()
          : "";
        text += `- ${cert.name} by ${cert.organization} ${
          date ? `(${date})` : ""
        }\n`;
      });
    }

    // 8. Thành tích (Achievements)
    if (
      data.achievements &&
      Array.isArray(data.achievements) &&
      data.achievements.length > 0
    ) {
      text += `\nACHIEVEMENTS:\n`;
      data.achievements.forEach((ach) => {
        const date = ach.date ? new Date(ach.date).getFullYear() : "";
        text += `- ${ach.title} ${date ? `(${date})` : ""}: ${
          ach.description || ""
        }\n`;
      });
    }

    // 9. Hoạt động ngoại khóa (Operations)
    if (
      data.operations &&
      Array.isArray(data.operations) &&
      data.operations.length > 0
    ) {
      text += `\nVOLUNTEERING & ACTIVITIES:\n`;
      data.operations.forEach((op) => {
        const start = op.startDate
          ? new Date(op.startDate).getFullYear()
          : "N/A";
        const end = op.endDate ? new Date(op.endDate).getFullYear() : "N/A";
        text += `- ${op.title} (${op.position}) [${start} - ${end}]: ${
          op.description || ""
        }\n`;
      });
    }

    return text;
  } catch (error) {
    console.error("Format Profile Error:", error);
    return "";
  }
};

// Helper làm sạch chuỗi JSON trả về từ AI
const cleanJsonString = (text) => {
  if (!text) return "{}";
  let cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace >= 0) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

// --- 3. CORE FUNCTIONS ---

// CHỨC NĂNG 1: TÍNH ĐIỂM HỒ SƠ (Cho Nhà Tuyển Dụng)
export const calculateApplicationScore = async (
  cvSnapshot,
  jobDescription,
  jobRequirements
) => {
  try {
    let resumeText = "";

    // Xử lý đầu vào CV
    if (!cvSnapshot) {
      return {
        aiScore: 0,
        aiFeedback: "No CV data found.",
        matchStatus: "Failed",
      };
    }

    const pdfUrl =
      cvSnapshot.fileData?.url ||
      (typeof cvSnapshot.resume === "string" &&
      cvSnapshot.resume.startsWith("http")
        ? cvSnapshot.resume
        : null);

    if (pdfUrl) {
      resumeText = await parsePdfFromUrl(pdfUrl);
    } else {
      resumeText = convertCvObjectToText(cvSnapshot);
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return {
        aiScore: 0,
        aiFeedback: "Cannot read CV content or content is too short.",
        matchStatus: "Failed",
      };
    }

    const requirementsText = Array.isArray(jobRequirements)
      ? jobRequirements.join(", ")
      : jobRequirements;

    // Prompt cho HR Recruiter
    const prompt = `
      You are an expert HR Recruiter System using AI to screen candidates. 
      Your task is to objectively evaluate the Candidate's Resume against the Job Description.

      --- JOB DESCRIPTION ---
      ${jobDescription}

      --- JOB REQUIREMENTS ---
      ${requirementsText}

      --- CANDIDATE RESUME ---
      ${resumeText}

      --- INSTRUCTIONS ---
      1. Analyze the correlation between the candidate's skills/experience and the job requirements.
      2. IGNORE irrelevant information. Focus on: Tech Stack, Experience Years, Key Achievements, and Education.
      3. Calculate a "Match Score" (0-100) based on strict criteria.
      4. Write a short, professional feedback (max 3 sentences) in **VIETNAMESE**.
      5. Determine match status: 
         - "High" (>= 80)
         - "Medium" (50 - 79)
         - "Low" (< 50)

      --- OUTPUT FORMAT ---
      Return ONLY a raw JSON object (no markdown):
      {
        "aiScore": number,
        "aiFeedback": "string",
        "matchStatus": "string"
      }
    `;
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsedData = JSON.parse(cleanJsonString(text));

    return {
      aiScore: parsedData.aiScore || 0,
      aiFeedback: parsedData.aiFeedback || "No feedback provided.",
      matchStatus: parsedData.matchStatus || "Pending",
    };
  } catch (error) {
    console.error("AI Calculate Score Error:", error);
    return {
      aiScore: 0,
      aiFeedback: "System error during analysis.",
      matchStatus: "Pending",
    };
  }
};

// CHỨC NĂNG 2: TƯ VẤN PHÙ HỢP CÔNG VIỆC (Cho Sinh Viên)
export const analyzeJobFitForStudent = async (
  studentProfile,
  jobDescription
) => {
  try {
    let profileText = "";

    // Xử lý đầu vào Profile
    if (
      typeof studentProfile === "string" &&
      studentProfile.startsWith("http")
    ) {
      profileText = await parsePdfFromUrl(studentProfile);
    } else if (typeof studentProfile === "object" && studentProfile !== null) {
      // Sử dụng hàm format đầy đủ nhất
      profileText = formatProfileForAI(studentProfile);
    }

    if (!profileText || profileText.trim().length < 10) {
      return {
        fitScore: 0,
        matchLabel: "Unreadable",
        summary: "Unable to read profile data.",
        strengths: [],
        missingSkills: [],
        advice: "Update your profile with skills and experience.",
      };
    }

    // Prompt cho Career Mentor
    const prompt = `
      You are an experienced Career Mentor and AI Coach. Your goal is to help a student evaluate their fit for a specific job.

      --- JOB DESCRIPTION ---
      ${jobDescription}

      --- STUDENT PROFILE ---
      ${profileText}

      --- TASK ---
      1. Analyze the match between the student's profile and the job description.
      2. Pay close attention to Skill Levels (Beginner vs Expert), Project Tech Stacks, Certifications, and Soft Skills from Activities.
      3. Identify matching skills (Strengths).
      4. Identify missing or weak skills (Gaps).
      5. Provide specific, actionable advice to improve their chances.

      --- OUTPUT REQUIREMENTS ---
      - Format: RETURN ONLY A RAW JSON OBJECT.
      - Language: **VIETNAMESE** (for all string fields).
      - JSON Structure:
      {
        "fitScore": number, // 0-100
        "matchLabel": string, // "Excellent" (>=80), "Good" (60-79), "Average" (40-59), "Needs Improvement" (<40)
        "summary": string, // General assessment (max 2 sentences) in VIETNAMESE
        "strengths": string[], // List of skills/experiences the student HAS in VIETNAMESE
        "missingSkills": string[], // List of skills the student LACKS in VIETNAMESE
        "advice": string // Detailed advice for the student in VIETNAMESE
      }
    `;

    // Sử dụng Model 2.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsedData = JSON.parse(cleanJsonString(text));

    return {
      fitScore: parsedData.fitScore || 0,
      matchLabel: parsedData.matchLabel || "Unknown",
      summary: parsedData.summary || "Chưa có đánh giá tổng quan.",
      strengths: parsedData.strengths || [],
      missingSkills: parsedData.missingSkills || [],
      advice: parsedData.advice || "Chưa có lời khuyên cụ thể.",
    };
  } catch (error) {
    console.error("AI Student Analysis Error:", error);
    return {
      fitScore: 0,
      matchLabel: "Error",
      summary: "Có lỗi xảy ra trong quá trình phân tích.",
      strengths: [],
      missingSkills: [],
      advice: "Vui lòng thử lại sau.",
    };
  }
};
