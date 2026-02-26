import React from "react";
import { useGetDriversQuery } from "../api/api";
import AddDriver from "@/components/AddDriver";
import DriversList from "@/components/DriversList";

const DriversPage: React.FC = () => {
  const { isLoading } = useGetDriversQuery();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Drivers</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          {isLoading && <div>Loading...</div>}
          <DriversList />
        </div>
        <AddDriver />
      </div>
    </div>
  );
};

export default DriversPage;
