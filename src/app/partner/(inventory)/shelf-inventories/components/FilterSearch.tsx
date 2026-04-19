import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/styles/components/ui/button";
import { Input } from "@/src/styles/components/ui/input";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { Store } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, Search, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  partnerStoreList?: Store[];
  onApplyFilter: (val: { locationId?: string }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  partnerStoreList,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [locationValue, setLocationValue] = useState(query.locationId || "");
  const debouncedLocation = useDebounce(locationValue, 300);

  useEffect(() => {
    if (debouncedLocation !== query.locationId) {
      onApplyFilter({
        locationId: debouncedLocation || undefined,
      });
    }
  }, [debouncedLocation]);

  return (
    <div className="inline-flex items-center gap-3">
      {/*Location id */}
      <select
        className="border rounded-md h-9 px-2"
        value={locationValue}
        onChange={(e) => setLocationValue(e.target.value)}
      >
        {partnerStoreList?.map((lo) => (
          <option key={lo.id} value={lo.inventoryLocationId}>
            {lo.name}
          </option>
        ))}
      </select>
    </div>
  );
}
