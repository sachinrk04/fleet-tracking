import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(50, "Product name cannot exceed 50 characters"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
