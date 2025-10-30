import { z } from "zod";

export const signupSchema = z.object({
  role: z.enum(["student", "recruiter"], {
    required_error: "Please select a role",
  }),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  file: z.any().optional(),
});
