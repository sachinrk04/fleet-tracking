import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "@/types/vehicleSchema";
import type { VehicleFormValues } from "@/types/vehicleSchema";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useCreateVehicleMutation } from "@/api/api";

const VehicleAdd = () => {
  const [createVehicle, { isLoading }] = useCreateVehicleMutation();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration: "",
      capacity: "",
      type: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: VehicleFormValues) => {
    await createVehicle({
      id: `vehicle-${crypto.randomUUID()}`,
      registration: data.registration,
      capacity: Number(data.capacity),
      type: data.type,
    }).unwrap();

    form.reset();
  };

  return (
    <div className="p-4 border rounded-md bg-card border-var h-[370px]">
      <h3 className="mb-4 text-lg font-semibold">Create Vehicle</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Registration */}
          <FormField
            control={form.control}
            name="registration"
            render={({ field }) => (
              <FormItem>
                <Label>Registration *</Label>
                <FormControl>
                  <Input placeholder="Enter registration number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Capacity */}
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <Label>Capacity *</Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter capacity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Label>Vehicle Type *</Label>
                <FormControl>
                  <Input placeholder="Enter vehicle type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Server Error */}
          {form.formState.errors.root && (
            <p className="text-sm text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={!form.formState.isValid || isLoading}
            className="w-full btn-var"
          >
            {isLoading ? "Creating..." : "Create Vehicle"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VehicleAdd;
