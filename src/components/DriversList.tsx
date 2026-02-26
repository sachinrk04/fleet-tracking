import { useGetDriversQuery } from "@/api/api";

const DriversList = () => {
  const { data: drivers } = useGetDriversQuery();

  return (
    <>
      <ul className="space-y-2">
        {drivers?.map((d) => (
          <li key={d.id} className="p-3 border rounded-md bg-card border-var">
            <div className="font-medium">{d.name}</div>
            <div className="text-sm">License: {d.license}</div>
            <div className="text-sm">Phone: {d.phone}</div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DriversList;
