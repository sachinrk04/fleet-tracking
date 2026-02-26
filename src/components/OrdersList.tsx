import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOrdersQuery, useUpdateOrderMutation } from "@/api/api";
import type { Order } from "@/types/models";
import { statusOptions } from "@/constants/ordersConstants";

const OrdersList = () => {
  const { data: orders } = useGetOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  return (
    <>
      <ul className="space-y-2">
        {orders?.map((o) => (
          <li
            key={o.id}
            className="flex items-center justify-between p-3 border rounded-md bg-card border-var"
          >
            <div>
              <div className="font-medium">{o.id}</div>
              <div className="text-sm">Destination: {o.destinationId}</div>
              <div className="text-sm">Quantity: {o.quantity}</div>
              <div className="text-sm">
                Driver: {o.assignedDriverId ?? "Unassigned"}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm">Status:</div>
              <Select
                value={o.status}
                onValueChange={async (value) => {
                  const newStatus = value as Order["status"];
                  await updateOrder({
                    id: o.id,
                    status: newStatus,
                  }).unwrap();
                }}
              >
                <SelectTrigger className="w-40 h-7">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default OrdersList;
