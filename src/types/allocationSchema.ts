import { z } from "zod";

export const allocationSchema = z.object({
  driverId: z.string().min(1, "Driver is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  date: z.string().min(1, "Date is required"),
});

export type AllocationFormValues = z.infer<typeof allocationSchema>;
