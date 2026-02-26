import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema } from "@/types/driverSchema";
import type { DriverFormValues } from "@/types/driverSchema";

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

import { useCreateDriverMutation } from "@/api/api";

const AddDriver = () => {
  const [createDriver, { isLoading }] = useCreateDriverMutation();

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: "",
      license: "",
      phone: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: DriverFormValues) => {
    await createDriver({
      id: `driver-${crypto.randomUUID()}`,
      name: data.name,
      license: data.license,
      phone: data.phone,
    }).unwrap();

    form.reset();
  };

  return (
    <div className="p-4 border rounded-md bg-card border-var h-[370px]">
      <h3 className="mb-4 text-lg font-semibold">Create Driver</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Name *</Label>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* License */}
          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <Label>License *</Label>
                <FormControl>
                  <Input placeholder="Enter license number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <Label>Phone *</Label>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
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
            {isLoading ? "Creating..." : "Create Driver"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddDriver;
