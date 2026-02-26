import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetVehiclesQuery, useUpdateVehicleMutation } from "@/api/api";

const VehiclesList = () => {
  const { data: vehicles } = useGetVehiclesQuery();
  const [updateVehicle] = useUpdateVehicleMutation();
  return (
    <>
      <ul className="space-y-2">
        {vehicles?.map((v) => (
          <li
            key={v.id}
            className="flex items-center justify-between p-3 border rounded-md bg-card border-var"
          >
            <div>
              <div className="font-medium">{v.registration}</div>
              <div className="text-sm">Type: {v.type}</div>
              <div className="text-sm">Capacity: {v.capacity}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm">Status</div>
              <Select
                value={v.status}
                onValueChange={async (value) => {
                  const newStatus = value as typeof v.status;
                  await updateVehicle({
                    id: v.id,
                    status: newStatus,
                  }).unwrap();
                }}
              >
                <SelectTrigger className="w-40 h-7">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idle">idle</SelectItem>
                  <SelectItem value="enroute">enroute</SelectItem>
                  <SelectItem value="maintenance">maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default VehiclesList;
