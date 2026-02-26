import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema } from "@/types/orderSchema";
import type { OrderFormValues } from "@/types/orderSchema";

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
  useGetDriversQuery,
  useGetHubsQuery,
  useGetProductsQuery,
  useGetVehiclesQuery,
  useCreateOrderMutation,
} from "@/api/api";

import type { Order } from "@/types/models";

const OrdersCreate = () => {
  const { data: hubs } = useGetHubsQuery();
  const { data: products } = useGetProductsQuery();
  const { data: drivers } = useGetDriversQuery();
  const { data: vehicles } = useGetVehiclesQuery();
  const [createOrder] = useCreateOrderMutation();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      destinationId: "",
      productId: "",
      quantity: "",
      deliveryDate: "",
      assignedDriverId: "",
      assignedVehicleId: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: OrderFormValues) => {
    const newOrder: Order = {
      id: `order-${crypto.randomUUID()}`,
      ...data,
      quantity: Number(data.quantity),
      status: data.assignedDriverId ? "assigned" : "created",
    };

    await createOrder(newOrder).unwrap();
    form.reset();
  };

  return (
    <div className="p-4 border rounded-md bg-card border-var h-[618px]">
      <h3 className="mb-4 text-lg font-semibold">Create Order</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Destination */}
          <FormField
            control={form.control}
            name="destinationId"
            render={({ field }) => (
              <FormItem>
                <Label>Destination *</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hubs?.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product */}
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <Label>Product *</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <Label>Quantity *</Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Delivery Date */}
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <Label>Delivery Date *</Label>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assign Driver */}
          <FormField
            control={form.control}
            name="assignedDriverId"
            render={({ field }) => (
              <FormItem>
                <Label>Assign Driver (Optional)</Label>
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

          {/* Assign Vehicle */}
          <FormField
            control={form.control}
            name="assignedVehicleId"
            render={({ field }) => (
              <FormItem>
                <Label>Assign Vehicle (Optional)</Label>
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

          <Button type="submit" className="w-full btn-var">
            Create Order
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OrdersCreate;
