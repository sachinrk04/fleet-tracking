import { z } from "zod";

export const driverSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  license: z.string().min(5, "License number must be at least 5 characters"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),
});

export type DriverFormValues = z.infer<typeof driverSchema>;
