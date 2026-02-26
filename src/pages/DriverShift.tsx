import React, { useMemo, useState } from "react";
import {
  useGetAllocationsQuery,
  useGetOrdersQuery,
  useGetVehiclesQuery,
  useGetHubsQuery,
  useUpdateVehicleMutation,
  useUpdateOrderMutation,
  useUpdateHubMutation,
} from "../api/api";

import { useToast } from "@/hooks/use-toast";
import SelectedDriver from "@/components/SelectedDriver";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

const randomOffset = () => (Math.random() - 0.5) * 0.01;

const DriverShift: React.FC = () => {
  const { toast } = useToast();
  const { data: allocations } = useGetAllocationsQuery();
  const { data: orders } = useGetOrdersQuery();
  const { data: vehicles } = useGetVehiclesQuery();
  const { data: hubs } = useGetHubsQuery();

  const [updateVehicle] = useUpdateVehicleMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [updateHub] = useUpdateHubMutation();

  const [selectedDriverId, setSelectedDriverId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fleet-driver-id") || "";
    }
    return "";
  });

  const handleDriverChange = (driverId: string) => {
    setSelectedDriverId(driverId);
    if (typeof window !== "undefined") {
      localStorage.setItem("fleet-driver-id", driverId);
    }
  };

  const driverAllocations = useMemo(
    () => allocations?.filter((a) => a.driverId === selectedDriverId) || [],
    [allocations, selectedDriverId],
  );
  const driverOrders = useMemo(
    () => orders?.filter((o) => o.assignedDriverId === selectedDriverId) || [],
    [orders, selectedDriverId],
  );

  const handleGPS = async () => {
    for (const a of driverAllocations) {
      const v = vehicles?.find((x) => x.id === a.vehicleId);
      if (!v || !v.currentLocation) continue;
      const newLoc = {
        lat: v.currentLocation.lat + randomOffset(),
        lng: v.currentLocation.lng + randomOffset(),
      };
      await updateVehicle({ id: v.id, currentLocation: newLoc }).unwrap();
    }
  };

  const handleComplete = async (orderId: string) => {
    const ord = orders?.find((o) => o.id === orderId);
    if (!ord) return;
    // update order status
    await updateOrder({ id: ord.id, status: "completed" }).unwrap();
    // update inventory on destination hub
    const hub = hubs?.find((h) => h.id === ord.destinationId);
    if (hub) {
      const current = hub.inventory[ord.productId] ?? 0;
      const updated = {
        ...hub.inventory,
        [ord.productId]: Math.max(0, current - ord.quantity),
      };
      await updateHub({ id: hub.id, inventory: updated }).unwrap();
      toast({
        title: "Delivery completed",
        description: "Inventory updated.",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Shift History</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4">
            <SelectedDriver
              selectedDriverId={selectedDriverId}
              handleDriverChange={handleDriverChange}
            />
          </div>

          <div className="p-3 mb-4 border rounded bg-card border-var">
            <div className="font-semibold">Today's Allocations</div>
            <ul className="mt-2 space-y-2">
              {driverAllocations.map((a) => (
                <li key={a.id} className="p-2 border rounded">
                  <div>Vehicle: {a.vehicleId}</div>
                  <div>Date: {a.date}</div>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Button onClick={handleGPS}>
                <Navigation className="w-4 h-4 mr-2" />
                Send GPS Update
              </Button>
            </div>
          </div>
          <div className="p-3 border rounded bg-card border-var">
            <div className="font-semibold">Assigned Deliveries</div>
            <ul className="mt-2 space-y-2">
              {driverOrders.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">
                      {o.productId} - {o.quantity}
                    </div>
                    <div className="text-sm">
                      Destination: {o.destinationId}
                    </div>
                    <div className="text-sm">Status: {o.status}</div>
                  </div>
                  <div className="space-x-2">
                    {o.status !== "completed" && o.status !== "failed" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleComplete(o.id)}
                          className="px-2 py-1 text-white bg-green-600 rounded"
                        >
                          Complete
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            updateOrder({ id: o.id, status: "failed" }).unwrap()
                          }
                          className="px-2 py-1 text-white bg-red-600 rounded"
                        >
                          Fail
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverShift;
