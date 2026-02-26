import React from "react";
import OrdersCreate from "@/components/OrdersCreate";
import OrdersList from "@/components/OrdersList";

const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="m-0 text-xl font-semibold">Orders</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <OrdersList />
        </div>
        <OrdersCreate />
      </div>
    </div>
  );
};

export default OrdersPage;
