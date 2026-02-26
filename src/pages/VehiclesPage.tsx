import React from "react";
import { useGetVehiclesQuery } from "../api/api";
import VehicleAdd from "@/components/VehicleAdd";
import VehiclesList from "@/components/VehiclesList";

const VehiclesPage: React.FC = () => {
  const { isLoading } = useGetVehiclesQuery();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Vehicles</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          {isLoading && <div>Loading...</div>}
          <VehiclesList />
        </div>

        <VehicleAdd />
      </div>
    </div>
  );
};

export default VehiclesPage;
