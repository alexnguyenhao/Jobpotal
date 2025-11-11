import { z } from "zod";

const singleEducation = z.object({
  school: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  major: z.string().min(1, "Major is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export const educationSchema = z.object({
  education: z
    .array(singleEducation)
    .min(1, "At least one education entry is required"),
});
