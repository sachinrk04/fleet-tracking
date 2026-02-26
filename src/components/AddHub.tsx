import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hubSchema } from "@/types/hubSchema";
import type { HubFormValues } from "@/types/hubSchema";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { useCreateHubMutation } from "@/api/api";
import type { Hub } from "@/types/models";

const AddHub = () => {
  const [createHub, { isLoading }] = useCreateHubMutation();

  const form = useForm<HubFormValues>({
    resolver: zodResolver(hubSchema),
    defaultValues: {
      name: "",
      type: "hub",
      address: "",
      lat: "",
      lng: "",
      diesel: "0",
      petrol: "0",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: HubFormValues) => {
    const newHub: Hub = {
      id: `hub-${crypto.randomUUID()}`,
      name: data.name,
      type: data.type,
      address: data.address || "",
      coordinates: {
        lat: Number(data.lat),
        lng: Number(data.lng),
      },
      inventory: {
        diesel: Number(data.diesel),
        petrol: Number(data.petrol),
      },
    };

    await createHub(newHub).unwrap();
    form.reset();
  };

  return (
    <div className="p-4 border rounded-md bg-card border-var h-[534px]">
      <h3 className="mb-4 text-lg font-semibold">Create Hub / Terminal</h3>

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

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Label>Type *</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hub">Hub</SelectItem>
                    <SelectItem value="terminal">Terminal</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <Label>Address</Label>
                <FormControl>
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coordinates */}
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Label>Latitude *</Label>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lng"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Label>Longitude *</Label>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Inventory */}
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="diesel"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Label>Diesel *</Label>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="petrol"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Label>Petrol *</Label>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Server Error */}
          {form.formState.errors.root && (
            <p className="text-sm text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            // disabled={!form.formState.isValid || isLoading}
            className="w-full btn-var"
          >
            {isLoading ? "Creating..." : "Create Hub"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddHub;
