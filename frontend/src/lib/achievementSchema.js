import { z } from "zod";

export const achievementSchema = z.object({
  achievements: z
    .array(z.string().min(3, "Achievement must be at least 3 characters"))
    .min(1, "At least one achievement is required"),
});
