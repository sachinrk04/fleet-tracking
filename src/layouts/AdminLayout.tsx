import React from "react";
import { adminRoutes } from "@/routes/adminRoutes";
import Sidebar from "@/components/Sidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar routes={adminRoutes} />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
