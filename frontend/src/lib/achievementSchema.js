import { z } from "zod";

const singleAchievement = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  year: z.string().min(1, "Year is required"),
});

export const achievementSchema = z.object({
  achievements: z
    .array(singleAchievement)
    .min(1, "At least one achievement is required"),
});
