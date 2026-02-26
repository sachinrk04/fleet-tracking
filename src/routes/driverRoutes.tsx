import DriverDashboard from "@/pages/DriverDashboard";
import DriverShift from "@/pages/DriverShift";
import VehicleLocationPage from "@/pages/VehicleLocationPage";

export const driverRoutes = [
  {
    path: "/",
    element: <DriverDashboard />,
    name: "Dashboard",
  },
  {
    path: "/shift-history",
    element: <DriverShift />,
    name: "Shift History",
  },
  {
    path: "/vehicle-location",
    element: <VehicleLocationPage />,
    name: "Vehicle Location",
  },
];
