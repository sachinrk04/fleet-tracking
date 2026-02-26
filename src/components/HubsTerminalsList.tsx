import { useGetHubsQuery } from "@/api/api";

const HubsTerminalsList = () => {
  const { data: hubs } = useGetHubsQuery();

  return (
    <>
      <ul className="space-y-2">
        {hubs?.map((h) => (
          <li key={h.id} className="p-3 border rounded-md bg-card border-var">
            <div className="font-medium">
              {h.name} <span className="text-sm text-gray-500">({h.type})</span>
            </div>
            <div className="text-sm">{h.address}</div>
            <div className="mt-1 text-sm">
              Inventory: Diesel {h.inventory.diesel}, Petrol{" "}
              {h.inventory.petrol}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default HubsTerminalsList;
