import { z } from "zod";

const singleOperation = z.object({
  title: z.string().min(1, "Title is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export const operationSchema = z.object({
  operations: z
    .array(singleOperation)
    .min(1, "At least one operation entry is required"),
});
