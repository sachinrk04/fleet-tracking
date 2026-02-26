export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Inventory {
  [productId: string]: number;
}

export interface Hub {
  id: string;
  name: string;
  type: "hub" | "terminal";
  address?: string;
  coordinates?: Coordinates;
  inventory: Inventory;
}

export interface Product {
  id: string;
  name: string;
}

export interface Driver {
  id: string;
  name: string;
  license?: string;
  phone?: string;
}

export interface Vehicle {
  id: string;
  registration: string;
  capacity?: number;
  type?: string;
  currentLocation?: Coordinates;
  status?: "idle" | "enroute" | "maintenance";
}

export type OrderStatus =
  | "created"
  | "assigned"
  | "in_transit"
  | "completed"
  | "failed";

export interface Order {
  id: string;
  destinationId: string;
  productId: string;
  quantity: number;
  deliveryDate: string; // ISO date
  assignedDriverId?: string | null;
  assignedVehicleId?: string | null;
  status: OrderStatus;
}

export interface Allocation {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string; // ISO date (day)
}
