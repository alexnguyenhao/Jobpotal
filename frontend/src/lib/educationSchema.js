import { z } from "zod";

const singleEducation = z
  .object({
    school: z.string().min(1, "School name is required"),
    degree: z.string().min(1, "Degree is required"),
    major: z.string().min(1, "Major is required"),
    startYear: z
      .string()
      .min(4, "Start year is required")
      .refine((val) => /^\d{4}$/.test(val), "Start year must be 4 digits"),
    endYear: z
      .string()
      .min(4, "End year is required")
      .refine((val) => /^\d{4}$/.test(val), "End year must be 4 digits"),
  })
  .refine((data) => Number(data.endYear) >= Number(data.startYear), {
    message: "End year must be after start year",
    path: ["endYear"],
  });

export const educationSchema = z.object({
  education: z
    .array(singleEducation)
    .min(1, "At least one education entry is required"),
});
