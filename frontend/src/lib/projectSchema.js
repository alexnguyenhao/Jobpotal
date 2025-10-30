// /lib/projectSchema.js
import { z } from "zod";

export const projectSchema = z.object({
  projects: z
    .array(
      z.object({
        title: z.string().min(1, "Project title is required"),
        description: z
          .string()
          .min(10, "Description must be at least 10 characters"),
        link: z.string().url("Invalid URL format").or(z.literal("")), // Cho phép bỏ trống link
        technologies: z.array(z.string().min(1)).optional().default([]),
      })
    )
    .min(1, "At least one project is required"),
});
