import React from "react";
import AllocationsCreate from "@/components/AllocationsCreate";
import AllocationsList from "@/components/AllocationsList";

const AllocationsPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Vehicle Allocations</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <AllocationsList />
        </div>
        <AllocationsCreate />
      </div>
    </div>
  );
};

export default AllocationsPage;
