import { z } from "zod";

const singleWork = z
  .object({
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const workSchema = z.object({
  experiences: z
    .array(singleWork)
    .min(1, "At least one experience is required"),
});
