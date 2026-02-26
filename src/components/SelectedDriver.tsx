import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetDriversQuery } from "@/api/api";

const SelectedDriver = ({
  selectedDriverId,
  handleDriverChange,
}: {
  selectedDriverId: string;
  handleDriverChange: (value: string) => void;
}) => {
  const { data: drivers } = useGetDriversQuery();
  return (
    <>
      <Label htmlFor="driver-select" className="block mb-1 text-sm font-medium">
        Select Driver
      </Label>
      <Select
        value={selectedDriverId}
        onValueChange={(value) => handleDriverChange(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select driver" />
        </SelectTrigger>
        <SelectContent>
          {drivers?.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectedDriver;
