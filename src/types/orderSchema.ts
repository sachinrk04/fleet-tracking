import { z } from "zod";

export const orderSchema = z.object({
  destinationId: z.string().min(1, "Destination is required"),
  productId: z.string().min(1, "Product is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Quantity must be a positive number",
    }),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  assignedDriverId: z.string().optional(),
  assignedVehicleId: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
