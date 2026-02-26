import React, { useMemo, useState } from "react";
import {
  useGetAllocationsQuery,
  useGetOrdersQuery,
  useGetVehiclesQuery,
  useGetHubsQuery,
  useGetProductsQuery,
  useUpdateOrderMutation,
  useUpdateHubMutation,
} from "@/api/api";
import type { Order } from "@/types/models";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Truck,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  History,
} from "lucide-react";
import SelectedDriver from "@/components/SelectedDriver";

const DRIVER_ID_KEY = "fleet-driver-id";

const DriverDashboard: React.FC<{ children?: React.ReactNode }> = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { toast } = useToast();

  const { data: allocations } = useGetAllocationsQuery();
  const { data: orders } = useGetOrdersQuery();
  const { data: vehicles } = useGetVehiclesQuery();
  const { data: hubs } = useGetHubsQuery();
  const { data: products } = useGetProductsQuery();

  const [updateOrder] = useUpdateOrderMutation();
  const [updateHub] = useUpdateHubMutation();

  const [selectedDriverId, setSelectedDriverId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(DRIVER_ID_KEY) || "";
    }
    return "";
  });
  const [shiftStarted, setShiftStarted] = useState(false);
  const [failedOrderId, setFailedOrderId] = useState<string | null>(null);
  const [failedReason, setFailedReason] = useState("");

  const todayAllocation = useMemo(
    () =>
      allocations?.find(
        (a) => a.driverId === selectedDriverId && a.date === today,
      ),
    [allocations, selectedDriverId, today],
  );

  const assignedOrders = useMemo(
    () =>
      orders?.filter(
        (o) =>
          o.assignedDriverId === selectedDriverId &&
          (o.deliveryDate === today || o.status === "in_transit") &&
          o.status !== "completed" &&
          o.status !== "failed",
      ) ?? [],
    [orders, selectedDriverId, today],
  );

  const currentVehicle = useMemo(() => {
    if (!todayAllocation || !vehicles) return null;
    return vehicles.find((v) => v.id === todayAllocation.vehicleId);
  }, [todayAllocation, vehicles]);

  const pastShifts = useMemo(() => {
    if (!allocations || !orders) return [];
    const driverAllocs = allocations.filter(
      (a) => a.driverId === selectedDriverId && a.date < today,
    );
    return driverAllocs
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10)
      .map((a) => {
        const dayOrders = orders.filter(
          (o) =>
            o.assignedDriverId === selectedDriverId &&
            o.deliveryDate === a.date,
        );
        const completed = dayOrders.filter(
          (o) => o.status === "completed",
        ).length;
        const failed = dayOrders.filter((o) => o.status === "failed").length;
        return {
          ...a,
          completed,
          failed,
          total: dayOrders.length,
        };
      });
  }, [allocations, orders, selectedDriverId, today]);

  const handleDriverChange = (driverId: string) => {
    setSelectedDriverId(driverId);
    setShiftStarted(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(DRIVER_ID_KEY, driverId);
    }
  };

  const handleStartShift = () => {
    if (!todayAllocation) return;
    setShiftStarted(true);
    toast({
      title: "Shift started",
      description: `Vehicle: ${currentVehicle?.registration ?? todayAllocation.vehicleId}`,
    });
  };

  const handleEndShift = () => {
    setShiftStarted(false);
    toast({
      title: "Shift ended",
      description: "Your shift has been ended. Thank you!",
    });
  };

  const handleComplete = async (order: Order) => {
    try {
      await updateOrder({ id: order.id, status: "completed" }).unwrap();
      const hub = hubs?.find((h) => h.id === order.destinationId);
      if (hub) {
        const current = hub.inventory[order.productId] ?? 0;
        await updateHub({
          id: hub.id,
          inventory: {
            ...hub.inventory,
            [order.productId]: Math.max(0, current - order.quantity),
          },
        }).unwrap();
      }
      toast({
        title: "Delivery completed",
        description: "Inventory has been updated.",
      });
    } catch {
      toast({
        title: "Failed to complete",
        variant: "destructive",
      });
    }
  };

  const handleOpenFailedModal = (orderId: string) => {
    setFailedOrderId(orderId);
    setFailedReason("");
  };

  const handleSubmitFailed = async () => {
    if (!failedOrderId) return;
    try {
      await updateOrder({ id: failedOrderId, status: "failed" }).unwrap();
      toast({
        title: "Delivery marked as failed",
        description: failedReason || "Reason recorded.",
      });
      setFailedOrderId(null);
      setFailedReason("");
    } catch {
      toast({
        title: "Failed to update",
        variant: "destructive",
      });
    }
  };

  const getProductName = (id: string) =>
    products?.find((p) => p.id === id)?.name ?? id;
  const getHubName = (id: string) => hubs?.find((h) => h.id === id)?.name ?? id;

  return (
    <div className="p-4 space-y-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="w-1/4 mb-4">
          <SelectedDriver
            selectedDriverId={selectedDriverId}
            handleDriverChange={handleDriverChange}
          />
        </div>

        <Tabs defaultValue="shift" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="shift" className="gap-2">
              <Truck className="w-4 h-4" />
              Current Shift
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              Shift History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shift" className="mt-4 space-y-6">
            {/* Shift View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Shift View
                </CardTitle>
                <CardDescription>
                  Today&apos;s shift details and assigned deliveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Today&apos;s shift
                        </p>
                        <p className="text-lg font-semibold">
                          {todayAllocation
                            ? `Vehicle: ${currentVehicle?.registration ?? todayAllocation.vehicleId}`
                            : "No allocation for today"}
                        </p>
                        {todayAllocation && (
                          <p className="text-sm text-muted-foreground">
                            {assignedOrders.length} delivery
                            {assignedOrders.length !== 1 ? "s" : ""} assigned
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleStartShift}
                        disabled={!todayAllocation || shiftStarted}
                        className="gap-2"
                      >
                        <Play className="w-4 h-4" />
                        {shiftStarted ? "Shift started" : "Start Shift"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">
                    Assigned deliveries
                  </h4>
                  <ul className="space-y-2">
                    {assignedOrders.length === 0 ? (
                      <li className="py-4 text-sm text-center border rounded-md text-muted-foreground">
                        No deliveries assigned for today
                      </li>
                    ) : (
                      assignedOrders.map((o) => (
                        <li
                          key={o.id}
                          className="flex items-center justify-between gap-2 p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {getProductName(o.productId)} × {o.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              → {getHubName(o.destinationId)}
                            </p>
                          </div>
                          <Badge variant="secondary">{o.status}</Badge>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Management */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Management</CardTitle>
                <CardDescription>
                  Mark deliveries as completed or failed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignedOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-2 p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {getProductName(o.productId)} × {o.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getHubName(o.destinationId)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="gap-1"
                        onClick={() => handleComplete(o)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark completed
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => handleOpenFailedModal(o.id)}
                      >
                        <XCircle className="w-4 h-4" />
                        Mark failed
                      </Button>
                    </div>
                  </div>
                ))}
                {assignedOrders.length === 0 && (
                  <p className="py-4 text-sm text-center border rounded-lg text-muted-foreground">
                    No active deliveries to manage
                  </p>
                )}
                {shiftStarted && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-destructive text-destructive hover:bg-destructive/10"
                    onClick={handleEndShift}
                  >
                    <Square className="w-4 h-4" />
                    End Shift
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Shift History
                </CardTitle>
                <CardDescription>
                  Past shifts and deliveries completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pastShifts.length === 0 ? (
                    <li className="py-6 text-sm text-center border rounded-lg text-muted-foreground">
                      No past shifts found
                    </li>
                  ) : (
                    pastShifts.map((shift) => (
                      <li
                        key={shift.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">
                            {format(new Date(shift.date), "PPP")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Vehicle ID: {shift.vehicleId}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="default">
                            {shift.completed} completed
                          </Badge>
                          {shift.failed > 0 && (
                            <Badge variant="destructive">
                              {shift.failed} failed
                            </Badge>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mark as Failed – reason modal */}
      <Dialog
        open={!!failedOrderId}
        onOpenChange={(open) => !open && setFailedOrderId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark delivery as failed</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="failed-reason">Reason (optional)</Label>
            <Textarea
              id="failed-reason"
              placeholder="e.g. Customer unavailable, address not found..."
              value={failedReason}
              onChange={(e) => setFailedReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFailedOrderId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSubmitFailed}>
              Mark as failed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverDashboard;
