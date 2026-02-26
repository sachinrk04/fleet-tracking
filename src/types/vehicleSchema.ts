import { z } from "zod";

export const vehicleSchema = z.object({
  registration: z
    .string()
    .min(3, "Registration must be at least 3 characters")
    .max(20, "Registration cannot exceed 20 characters"),

  capacity: z
    .string()
    .min(1, "Capacity is required")
    .refine((val) => !isNaN(Number(val)), "Capacity must be a number")
    .refine((val) => Number(val) > 0, "Capacity must be greater than 0"),

  type: z.string().min(2, "Vehicle type must be at least 2 characters"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
