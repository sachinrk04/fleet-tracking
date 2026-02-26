import AdminDashboard from "@/pages/AdminDashboard";
import HubsPage from "@/pages/HubsPage";
import DriversPage from "@/pages/DriversPage";
import VehiclesPage from "@/pages/VehiclesPage";
import ProductsPage from "@/pages/ProductsPage";
import OrdersPage from "@/pages/OrdersPage";
import AllocationsPage from "@/pages/AllocationsPage";
import InventoryPage from "@/pages/InventoryPage";

export const adminRoutes = [
  {
    path: "/",
    element: <AdminDashboard />,
    name: "Dashboard",
  },
  {
    path: "/hubs",
    element: <HubsPage />,
    name: "Hubs & Terminals",
  },
  {
    path: "/drivers",
    element: <DriversPage />,
    name: "Drivers",
  },
  {
    path: "/vehicles",
    element: <VehiclesPage />,
    name: "Vehicles",
  },
  {
    path: "/products",
    element: <ProductsPage />,
    name: "Products",
  },
  {
    path: "/orders",
    element: <OrdersPage />,
    name: "Orders",
  },
  {
    path: "/allocations",
    element: <AllocationsPage />,
    name: "Allocations",
  },
  {
    path: "/inventory",
    element: <InventoryPage />,
    name: "Inventory",
  },
];
