import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Hub,
  Driver,
  Vehicle,
  Product,
  Order,
  Allocation,
} from "../types/models";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  tagTypes: [
    "Hubs",
    "Drivers",
    "Vehicles",
    "Products",
    "Orders",
    "Allocations",
  ],
  endpoints: (builder) => ({
    getHubs: builder.query<Hub[], void>({
      query: () => "/hubs",
      providesTags: ["Hubs"],
    }),
    getDrivers: builder.query<Driver[], void>({
      query: () => "/drivers",
      providesTags: ["Drivers"],
    }),
    getVehicles: builder.query<Vehicle[], void>({
      query: () => "/vehicles",
      providesTags: ["Vehicles"],
    }),
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getAllocations: builder.query<Allocation[], void>({
      query: () => "/allocations",
      providesTags: ["Allocations"],
    }),
    createHub: builder.mutation<Hub, Partial<Hub>>({
      query: (body) => ({ url: "/hubs", method: "POST", body }),
      invalidatesTags: ["Hubs"],
    }),
    createDriver: builder.mutation<Driver, Partial<Driver>>({
      query: (body) => ({ url: "/drivers", method: "POST", body }),
      invalidatesTags: ["Drivers"],
    }),
    createVehicle: builder.mutation<Vehicle, Partial<Vehicle>>({
      query: (body) => ({ url: "/vehicles", method: "POST", body }),
      invalidatesTags: ["Vehicles"],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Products"],
    }),
    updateVehicle: builder.mutation<
      Vehicle,
      Partial<Vehicle> & Pick<Vehicle, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/vehicles/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    updateHub: builder.mutation<Hub, Partial<Hub> & Pick<Hub, "id">>({
      query: ({ id, ...patch }) => ({
        url: `/hubs/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Hubs"],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Orders"],
    }),
    createAllocation: builder.mutation<Allocation, Partial<Allocation>>({
      query: (body) => ({ url: "/allocations", method: "POST", body }),
      invalidatesTags: ["Allocations"],
    }),
    updateOrder: builder.mutation<Order, Partial<Order> & Pick<Order, "id">>({
      query: ({ id, ...patch }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetHubsQuery,
  useGetDriversQuery,
  useGetVehiclesQuery,
  useGetProductsQuery,
  useGetOrdersQuery,
  useGetAllocationsQuery,
  useCreateOrderMutation,
  useCreateAllocationMutation,
  useUpdateOrderMutation,
  useCreateHubMutation,
  useCreateDriverMutation,
  useCreateVehicleMutation,
  useCreateProductMutation,
  useUpdateVehicleMutation,
  useUpdateHubMutation,
} = api;
