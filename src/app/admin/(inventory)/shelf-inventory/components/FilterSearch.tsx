import { useDebounce } from "@/src/hooks/useDebounce";
import { InventoryLocation, Partner } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { useEffect, useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  partnerList?: Partner[];
  locationList?: InventoryLocation[];
  onApplyFilter: (val: { locationId?: string; partnerId?: string }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  partnerList,
  locationList,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [locationValue, setLocationValue] = useState(query.locationId || "");
  const debouncedLocation = useDebounce(locationValue, 300);

  const [partnerValue, setPartnerValue] = useState(query.partnerId || "");
  const debouncedPartner = useDebounce(partnerValue, 300);

  useEffect(() => {
    if (debouncedPartner !== query.partnerId) {
      onApplyFilter({
        partnerId: debouncedPartner || undefined,
        locationId: undefined,
      });
    }
  }, [debouncedPartner]);

  useEffect(() => {
    if (debouncedLocation !== query.locationId) {
      onApplyFilter({
        locationId: debouncedLocation || undefined,
      });
    }
  }, [debouncedLocation]);

  return (
    <div className="inline-flex items-center gap-3">
      {/*Partner */}
      <select
        className="border rounded-md h-9 px-2"
        value={partnerValue}
        onChange={(e) => setPartnerValue(e.target.value)}
      >
        <option value={""}>Chọn đối tác</option>
        {partnerList?.map((p) => (
          <option key={p.id} value={p.id}>
            {p.companyName}
          </option>
        ))}
      </select>
      {/*Location id */}
      <select
        className="border rounded-md h-9 px-2"
        value={locationValue}
        onChange={(e) => setLocationValue(e.target.value)}
      >
        {locationList?.map((lo) => (
          <option key={lo.id} value={lo.id}>
            {lo.name}
          </option>
        ))}
      </select>
    </div>
  );
}
