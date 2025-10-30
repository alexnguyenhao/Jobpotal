import { z } from "zod";

const singleCert = z.object({
  name: z.string().min(1, "Certification name is required"),
  organization: z.string().min(1, "Issuing organization is required"),
  dateIssued: z
    .string()
    .min(1, "Issue date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
});

export const certificationSchema = z.object({
  certifications: z
    .array(singleCert)
    .min(1, "At least one certification is required"),
});
