import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  requirements: z.string().min(5, "Requirements are required"),
  benefits: z.string().optional(),
  salaryMin: z.coerce.number().min(1, "Min salary required"),
  salaryMax: z.coerce.number().min(1, "Max salary required"),
  currency: z.enum(["VND", "USD"]),
  isNegotiable: z.boolean(),
  province: z.string().min(1, "Province is required"),
  district: z.string().optional(),
  address: z.string().optional(),
  jobType: z.array(z.string()).nonempty("Select at least one job type"),
  experience: z.string().min(1, "Experience is required"),
  position: z.coerce.number().min(1, "Number of positions must be ≥ 1"),
  companyId: z.string().min(1, "Company is required"),
  categoryId: z.string().min(1, "Category is required"),
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
});
