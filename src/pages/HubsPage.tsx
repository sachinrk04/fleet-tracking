import React from "react";
import { useGetHubsQuery } from "../api/api";
import AddHub from "@/components/AddHub";
import HubsTerminalsList from "@/components/HubsTerminalsList";

const HubsPage: React.FC = () => {
  const { isLoading } = useGetHubsQuery();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Hubs & Terminals</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          {isLoading && <div>Loading...</div>}
          <HubsTerminalsList />
        </div>
        <AddHub />
      </div>
    </div>
  );
};

export default HubsPage;
