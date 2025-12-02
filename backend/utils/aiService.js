import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParseLib = require("pdf-parse");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    return "";
  }
};

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

const formatProfileForAI = (profileData) => {
  try {
    if (!profileData) return "";

    const data = profileData.toObject ? profileData.toObject() : profileData;

    let text = `--- CANDIDATE PROFILE ---\n`;
    text += `TITLE: ${data.title || "N/A"}\n`;
    text += `OBJECTIVE: ${data.careerObjective || "N/A"}\n`;

    text += `\nSKILLS:\n`;
    if (data.skills && Array.isArray(data.skills)) {
      text += data.skills
        .map((s) => `- ${s.name} (${s.level || "Intermediate"})`)
        .join("\n");
    }

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

    text += `\nPROJECTS:\n`;
    if (data.projects && Array.isArray(data.projects)) {
      data.projects.forEach((proj) => {
        text += `- ${proj.title}: ${proj.description || ""}\n`;
        if (proj.technologies && proj.technologies.length > 0) {
          text += `  Tech Stack: ${proj.technologies.join(", ")}\n`;
        }
      });
    }

    text += `\nEDUCATION:\n`;
    if (data.education && Array.isArray(data.education)) {
      data.education.forEach((edu) => {
        text += `- ${edu.degree || "Degree"} in ${edu.major || "Major"} at ${
          edu.school
        }\n`;
      });
    }

    if (data.languages && Array.isArray(data.languages)) {
      text += `\nLANGUAGES: ${data.languages
        .map((l) => `${l.language} (${l.proficiency})`)
        .join(", ")}\n`;
    }

    return text;
  } catch (error) {
    return "";
  }
};

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

export const calculateApplicationScore = async (
  cvSnapshot,
  jobDescription,
  jobRequirements
) => {
  try {
    let resumeText = "";

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

    const prompt = `
      You are an expert HR Recruiter System. Evaluate the Candidate's Resume against the Job Description.

      JOB DESCRIPTION:
      ${jobDescription}

      JOB REQUIREMENTS:
      ${requirementsText}

      CANDIDATE RESUME CONTENT:
      ${resumeText}

      INSTRUCTIONS:
      1. Compare the candidate's skills/experience with the job requirements.
      2. Calculate a match score (0-100).
      3. Write a short feedback (max 3 sentences) in **VIETNAMESE**.
      4. Determine match status: "High" (>=80), "Medium" (50-79), "Low" (<50).

      OUTPUT FORMAT:
      Return ONLY a JSON object with these exact keys:
      {
        "aiScore": number,
        "aiFeedback": "string",
        "matchStatus": "string"
      }
    `;

    let result;
    try {
      const modelFlash = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });
      result = await modelFlash.generateContent(prompt);
    } catch (err) {
      const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
      result = await modelPro.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();
    const parsedData = JSON.parse(cleanJsonString(text));

    return {
      aiScore: parsedData.aiScore || 0,
      aiFeedback: parsedData.aiFeedback || "No feedback provided.",
      matchStatus: parsedData.matchStatus || "Pending",
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      aiScore: 0,
      aiFeedback: "System error during analysis.",
      matchStatus: "Pending",
    };
  }
};

export const analyzeJobFitForStudent = async (
  studentProfile,
  jobDescription
) => {
  try {
    let profileText = "";

    if (
      typeof studentProfile === "string" &&
      studentProfile.startsWith("http")
    ) {
      profileText = await parsePdfFromUrl(studentProfile);
    } else if (typeof studentProfile === "object" && studentProfile !== null) {
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

    const prompt = `
      You are an experienced Career Mentor and AI Coach. Your goal is to help a student evaluate their fit for a specific job.

      JOB DESCRIPTION:
      ${jobDescription}

      STUDENT PROFILE:
      ${profileText}

      TASK:
      1. Analyze the match between the student's profile and the job description.
      2. Pay close attention to Skill Levels (Beginner vs Expert) and Project Tech Stacks.
      3. Identify matching skills (Strengths).
      4. Identify missing or weak skills (Gaps).
      5. Provide specific, actionable advice.

      OUTPUT REQUIREMENTS:
      - Format: RETURN ONLY A RAW JSON OBJECT.
      - JSON Structure:
      {
        "fitScore": number, // 0-100
        "matchLabel": string, // "Excellent", "Good", "Average", "Needs Improvement"
        "summary": string, // General assessment (max 2 sentences) in VIETNAMESE
        "strengths": string[], // List of skills/experiences the student HAS in VIETNAMESE
        "missingSkills": string[], // List of skills the student LACKS in VIETNAMESE
        "advice": string // Detailed advice for the student in VIETNAMESE
      }
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = cleanJsonString(text);
    const parsedData = JSON.parse(jsonString);

    return {
      fitScore: parsedData.fitScore || 0,
      matchLabel: parsedData.matchLabel || "Unknown",
      summary: parsedData.summary || "No summary provided.",
      strengths: parsedData.strengths || [],
      missingSkills: parsedData.missingSkills || [],
      advice: parsedData.advice || "No advice provided.",
    };
  } catch (error) {
    console.error("AI Student Analysis Error:", error);
    return {
      fitScore: 0,
      matchLabel: "Error",
      summary: "An error occurred during analysis.",
      strengths: [],
      missingSkills: [],
      advice: "Please try again later.",
    };
  }
};
