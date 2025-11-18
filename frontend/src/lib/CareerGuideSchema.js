import { z } from "zod";

export const careerGuideSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters." })
    .max(150, { message: "Title must not exceed 150 characters." }),

  thumbnail: z.string().optional().or(z.literal("")), // Allows empty string or valid URL

  excerpt: z
    .string()
    .max(300, { message: "Excerpt must not exceed 300 characters." })
    .optional(), // Optional (Backend will auto-generate if empty)

  category: z.string().min(1, { message: "Please select a category." }),

  tags: z.string().optional(),

  content: z
    .string()
    .min(20, { message: "Content is too short (min 20 characters)." }),

  isPublished: z.boolean().default(true),
});
