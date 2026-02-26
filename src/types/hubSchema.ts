import { z } from "zod";

export const hubSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  type: z.enum(["hub", "terminal"], { message: "Type is required" }),

  address: z.string().optional(),

  lat: z
    .string()
    .min(1, { message: "Latitude is required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Latitude must be a number",
    })
    .refine((val) => Number(val) >= -90 && Number(val) <= 90, {
      message: "Latitude must be between -90 and 90",
    }),

  lng: z
    .string()
    .min(1, { message: "Longitude is required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Longitude must be a number",
    })
    .refine((val) => Number(val) >= -180 && Number(val) <= 180, {
      message: "Longitude must be between -180 and 180",
    }),

  diesel: z
    .string()
    .min(1, { message: "Diesel is required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Diesel must be a number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Diesel cannot be negative",
    }),

  petrol: z
    .string()
    .min(1, { message: "Petrol is required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Petrol must be a number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Petrol cannot be negative",
    }),
});

export type HubFormValues = z.infer<typeof hubSchema>;
