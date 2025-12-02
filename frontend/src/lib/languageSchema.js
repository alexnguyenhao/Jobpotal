import { z } from "zod";

const singleLanguage = z.object({
  language: z.string().min(1, "Language name is required"),
  proficiency: z.enum(["Basic", "Conversational", "Fluent", "Native"]),
});

export const languageSchema = z.object({
  languages: z
    .array(singleLanguage)
    .min(1, "At least one language entry is required"),
});
