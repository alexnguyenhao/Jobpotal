import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(8, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  bio: z.string().optional(),
  careerObjective: z.string().optional(),
  skills: z.string().optional(),
  file: z.any().optional(),
});
