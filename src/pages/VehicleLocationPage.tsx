import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";
import {
  useGetAllocationsQuery,
  useGetOrdersQuery,
  useUpdateVehicleMutation,
  useGetVehiclesQuery,
  useGetHubsQuery,
} from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import type { Coordinates } from "@/types/models";
import RecenterMap from "@/components/RecenterMap";
import SelectedDriver from "@/components/SelectedDriver";

const randomOffset = () => (Math.random() - 0.5) * 0.01;

const VehicleLocationPage = () => {
  const { toast } = useToast();

  const { data: allocations } = useGetAllocationsQuery();
  const { data: orders } = useGetOrdersQuery();
  const { data: vehicles } = useGetVehiclesQuery();
  const { data: hubs } = useGetHubsQuery();

  const [updateVehicle] = useUpdateVehicleMutation();

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

  const todayAllocation = useMemo(
    () => allocations?.find((a) => a.driverId === selectedDriverId),
    [allocations, selectedDriverId],
  );

  const assignedOrders = useMemo(
    () =>
      orders?.filter(
        (o) =>
          o.assignedDriverId === selectedDriverId &&
          o.status !== "completed" &&
          o.status !== "failed",
      ) ?? [],
    [orders, selectedDriverId],
  );

  const currentVehicle = useMemo(() => {
    if (!todayAllocation || !vehicles) return null;
    return vehicles.find((v) => v.id === todayAllocation.vehicleId);
  }, [todayAllocation, vehicles]);

  const defaultLocation = useMemo(() => ({ lat: 12.9629, lng: 77.5775 }), []);

  const driverLocation = useMemo(
    () => currentVehicle?.currentLocation ?? defaultLocation,
    [currentVehicle?.currentLocation, defaultLocation],
  );

  const deliveryDestinations = useMemo(() => {
    if (!hubs) return [];
    const destIds = [...new Set(assignedOrders.map((o) => o.destinationId))];

    return destIds
      .map((id) => hubs.find((h) => h.id === id))
      .filter((h): h is NonNullable<typeof h> => !!h && !!h.coordinates);
  }, [hubs, assignedOrders]);

  const routePositions = useMemo((): [number, number][] => {
    const start: [number, number] = [driverLocation.lat, driverLocation.lng];
    const points = deliveryDestinations.map(
      (h) => [h.coordinates!.lat, h.coordinates!.lng] as [number, number],
    );
    return [start, ...points];
  }, [driverLocation, deliveryDestinations]);

  const handleSendGps = async () => {
    if (!currentVehicle) return;

    const newLoc: Coordinates = {
      lat: driverLocation.lat + randomOffset(),
      lng: driverLocation.lng + randomOffset(),
    };

    try {
      await updateVehicle({
        id: currentVehicle.id,
        currentLocation: newLoc,
      }).unwrap();

      toast({
        title: "GPS updated",
        description: "Location sent successfully.",
      });
    } catch {
      toast({
        title: "GPS update failed",
        variant: "destructive",
      });
    }
  };

  const mapCenter: [number, number] = [driverLocation.lat, driverLocation.lng];

  return (
    <div>
      <div className="mb-4">
        <SelectedDriver
          selectedDriverId={selectedDriverId}
          handleDriverChange={handleDriverChange}
        />
      </div>

      <Card className="rounded-md border-var">
        <CardHeader className="border-var">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Live Map
          </CardTitle>
          <CardDescription>
            Your location and delivery destinations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="h-[490px] w-full rounded-sm overflow-hidden border">
            <MapContainer
              center={mapCenter}
              zoom={13}
              className="w-full h-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <RecenterMap lat={driverLocation.lat} lng={driverLocation.lng} />

              <Marker position={mapCenter}>
                <Popup>
                  <span className="font-semibold">You (driver)</span>
                  <br />
                  {currentVehicle?.registration}
                </Popup>
              </Marker>

              {deliveryDestinations.map((h) => (
                <Marker
                  key={h.id}
                  position={[h.coordinates!.lat, h.coordinates!.lng]}
                >
                  <Popup>
                    <span className="font-semibold">{h.name}</span>
                    <br />
                    {h.address}
                  </Popup>
                </Marker>
              ))}

              {routePositions.length > 1 && (
                <Polyline
                  positions={routePositions}
                  color="#f97316"
                  weight={4}
                  opacity={0.7}
                />
              )}
            </MapContainer>
          </div>

          <Button onClick={handleSendGps} className="w-full gap-2 sm:w-auto">
            <Navigation className="w-4 h-4" />
            Send GPS Update
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleLocationPage;
