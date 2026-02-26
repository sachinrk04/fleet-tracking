import { useGetAllocationsQuery } from "@/api/api";

const AllocationsList = () => {
  const { data: allocations } = useGetAllocationsQuery();
  return (
    <>
      <ul className="space-y-2">
        {allocations?.map((a) => (
          <li key={a.id} className="p-3 border rounded-md bg-card border-var">
            <div className="font-medium">{a.id}</div>
            <div className="text-sm">Vehicle: {a.vehicleId}</div>
            <div className="text-sm">Driver: {a.driverId}</div>
            <div className="text-sm">Date: {a.date}</div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AllocationsList;
