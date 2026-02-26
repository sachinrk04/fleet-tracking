import React from "react";
import { useGetHubsQuery } from "../api/api";

const InventoryPage: React.FC = () => {
  const { data: hubs } = useGetHubsQuery();

  const colorFor = (qty: number) => {
    if (qty < 3000) return "bg-red-100 text-red-800";
    if (qty < 7000) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Inventory Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {hubs?.map((h) => (
          <div key={h.id} className="p-4 border rounded border-var">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {h.name}{" "}
                  <span className="text-sm text-gray-500">({h.type})</span>
                </div>
                <div className="text-sm">{h.address}</div>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(h.inventory).map(([product, qty]) => (
                <div
                  key={product}
                  className="flex items-center justify-between"
                >
                  <div className="text-sm capitalize">{product}</div>
                  <div
                    className={`px-2 py-1 rounded ${colorFor(qty as number)}`}
                  >
                    {qty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InventoryPage;
