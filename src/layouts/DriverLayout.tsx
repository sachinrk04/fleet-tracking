import { driverRoutes } from "@/routes/driverRoutes";
import React from "react";
import Sidebar from "@/components/Sidebar";

const DriverLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar routes={driverRoutes} />
      <main className="flex-1 p-4 overflow-hidden">{children}</main>
    </div>
  );
};

export default DriverLayout;
