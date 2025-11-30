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
    if (!pdfUrl) return null;
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
      throw new Error("Can't parse PDF: Export is not a function.");
    }
    const data = await pdfParser(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error.message);
    return null;
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
    text += `SKILLS: ${skills.join(", ")}\n\n`;

    text += `EXPERIENCE:\n`;
    experience.forEach((exp) => {
      text += `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}\n`;
    });

    text += `\nEDUCATION:\n`;
    education.forEach((edu) => {
      text += `- ${edu.degree} in ${edu.major} at ${edu.school}\n`;
    });

    text += `\nPROJECTS:\n`;
    projects.forEach((proj) => {
      text += `- ${proj.title}: ${
        proj.description
      } (Tech: ${proj.technologies?.join(", ")})\n`;
    });

    return text;
  } catch (error) {
    console.error("Error converting CV object:", error);
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
  resumeSource,
  jobDescription,
  jobRequirements
) => {
  try {
    let resumeText = "";

    if (typeof resumeSource === "string" && resumeSource.startsWith("http")) {
      resumeText = await parsePdfFromUrl(resumeSource);
    } else if (typeof resumeSource === "object" && resumeSource !== null) {
      resumeText = convertCvObjectToText(resumeSource);
    } else {
      resumeText = "";
    }

    if (!resumeText || resumeText.trim().length < 10) {
      return {
        aiScore: 0,
        aiFeedback: "Can't read resume content.",
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
      console.warn(
        "Gemini 2.5 Flash failed, attempting fallback to Gemini Pro...",
        err.message
      );
      const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
      result = await modelPro.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();

    const jsonString = cleanJsonString(text);
    const parsedData = JSON.parse(jsonString);

    return {
      aiScore: parsedData.aiScore || 0,
      aiFeedback: parsedData.aiFeedback || "No feedback provided.",
      matchStatus: parsedData.matchStatus || "Pending",
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      aiScore: 0,
      aiFeedback: "System error",
      matchStatus: "Pending",
    };
  }
};
