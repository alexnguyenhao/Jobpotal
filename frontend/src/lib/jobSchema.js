import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Job title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(5, "Requirements are required"),
  salary: z.string().min(1, "Salary is required"),
  location: z.string().min(2, "Location is required"),
  jobType: z.array(z.string()).min(1, "Please select at least one job type"),
  experience: z.string().min(1, "Experience level is required"),
  position: z.coerce.number().min(1, "At least one position is required"),
  companyId: z.string().min(1, "Company is required"),
  categoryId: z.string().min(1, "Category is required"),
  seniorityLevel: z.string().min(1, "Seniority level is required"),
  applicationDeadline: z
    .string()
    .refine(
      (val) => new Date(val) >= new Date(),
      "Deadline must be in the future"
    ),
  benefits: z.string().optional(),
});
