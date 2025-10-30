import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  industry: z.string().min(2, "Industry is required"),
  foundedYear: z
    .string()
    .refine((val) => /^\d{4}$/.test(val), "Enter a valid year")
    .optional()
    .or(z.literal("")),
  employeeCount: z
    .string()
    .optional()
    .refine((val) => !val || Number(val) >= 0, "Must be positive"),
  phone: z
    .string()
    .min(8, "Phone number is required")
    .regex(/^[0-9+() -]+$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  tags: z.string().optional(),
  status: z.enum(["active", "inactive", "banned"]),
  isVerified: z.boolean(),
  file: z.any().optional(),
});
