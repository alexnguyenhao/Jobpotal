import { z } from "zod";

export const jobSchema = z
  .object({
    title: z.string().min(3, "Title is required"),
    professional: z
      .array(z.string())
      .min(1, "Select at least one specialization"),
    description: z.string().min(10, "Description is required"),
    requirements: z.string().min(5, "Requirements are required"),
    benefits: z.string().optional(),
    salaryMin: z.coerce.number().min(1, "Min salary required"),
    salaryMax: z.coerce.number().min(1, "Max salary required"),
    currency: z.enum(["VND", "USD"]),
    isNegotiable: z.boolean(),
    location: z.object({
      province: z.string().min(1, "Province is required"),
      district: z.string().min(1, "District is required"),
      ward: z.string().optional(),
      address: z.string().min(1, "Address is required"),
    }),
    jobType: z.array(z.string()).nonempty("Select at least one job type"),
    experienceLevel: z.string().min(1, "Experience is required"),
    numberOfPositions: z.coerce
      .number()
      .min(1, "Number of positions must be ≥ 1"),
    company: z.string().min(1, "Company is required"),
    category: z.string().min(1, "Category is required"),
    seniorityLevel: z
      .enum([
        "Intern",
        "Junior",
        "Mid",
        "Senior",
        "Lead",
        "Manager",
        "Director",
        "Executive",
      ])
      .optional(),
    applicationDeadline: z.string().min(1, "Deadline is required"),
  })
  .refine((data) => Number(data.salaryMax) >= Number(data.salaryMin), {
    message: "Max salary must be greater than or equal to min salary",
    path: ["salaryMax"],
  });
