import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import {
  useGetAllocationsQuery,
  useGetDriversQuery,
  useGetVehiclesQuery,
  useCreateAllocationMutation,
} from "@/api/api";
import {
  allocationSchema,
  type AllocationFormValues,
} from "@/types/allocationSchema";

const AllocationsCreate = () => {
  const { data: allocations } = useGetAllocationsQuery();
  const { data: drivers } = useGetDriversQuery();
  const { data: vehicles } = useGetVehiclesQuery();
  const [createAllocation] = useCreateAllocationMutation();

  const form = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      driverId: "",
      vehicleId: "",
      date: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: AllocationFormValues) => {
    const conflict = allocations?.find(
      (a) => a.vehicleId === data.vehicleId && a.date === data.date,
    );
    if (conflict) {
      form.setError("vehicleId", {
        message: "Vehicle already allocated on this date",
      });
      return;
    }

    await createAllocation({
      id: `alloc-${crypto.randomUUID()}`,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      date: data.date,
    }).unwrap();
    form.reset();
  };

  return (
    <div className="p-4 border rounded-md bg-card border-var h-[370px]">
      <h3 className="mb-4 text-lg font-semibold">Create Allocation</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Driver */}
          <FormField
            control={form.control}
            name="driverId"
            render={({ field }) => (
              <FormItem>
                <Label>Driver *</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {drivers?.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vehicle */}
          <FormField
            control={form.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <Label>Vehicle *</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicles?.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.registration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <Label>Date *</Label>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full btn-var">
            Allocate
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AllocationsCreate;
