import { useDebounce } from "@/src/hooks/useDebounce";
import { InventoryLocation, Partner, Store } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { Button } from "@/src/styles/components/ui/button";
import { Filter, RotateCcw, XCircle } from "lucide-react";
import { Label } from "@/src/styles/components/ui/label";
import { PopoverClose } from "@radix-ui/react-popover";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  partnerStoreList?: Store[];
  onApplyFilter: (val: {
    pageSize?: number;
    status?: string;
    pageNumber?: number;
    inventoryLocationId?: string;
  }) => void;
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
  const [locationValue, setLocationValue] = useState(
    query.inventoryLocationId || "",
  );
  const debouncedLocation = useDebounce(locationValue, 300);

  useEffect(() => {
    if (debouncedLocation !== query.inventoryLocationId) {
      onApplyFilter({
        inventoryLocationId: debouncedLocation || undefined,
        pageNumber: 1,
      });
    }
  }, [debouncedLocation]);

  const [tempFilter, setTempFilter] = useState<{
    status: string;
    pageSize: number;
    pageNumber: number;
  }>({
    status: query.categoryId ?? "",
    pageSize: query.pageSize ?? 10,
    pageNumber: query.pageNumber ?? 1,
  });

  const isFiltered = query.status !== "" || query.pageSize !== 10;

  const handleApply = () => {
    onApplyFilter({
      pageSize: tempFilter.pageSize || 10,
      status: tempFilter.status || undefined,
      pageNumber: 1,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: "",
      pageNumber: 1,
      pageSize: 10,
    });
    onReset();
  };

  return (
    <div className="inline-flex items-center gap-3">
      {/* FILTER */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" disabled={loading}>
            <Filter className="w-4 h-4 mr-1" />
            Bộ lọc
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-64">
          <div className="grid gap-4">
            {/* Page Size */}
            <div className="grid gap-2">
              <Label>Hiển thị</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.pageSize}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    pageSize: Number(e.target.value),
                    pageNumber: 1,
                  }))
                }
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label>Trạng thái</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.status}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    status: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                <option value="Available">Còn hàng</option>
                <option value="Reserved">Đã đặt trước</option>
                <option value="InTransit">Đang vận chuyển</option>
                <option value="InUse">Đang sử dụng</option>
                <option value="Recalled">Đã thu hồi</option>
                <option value="PendingMaintenance">Chờ bảo trì</option>
                <option value="Maintenance">Đang bảo trì</option>
                <option value="Retired">Ngừng sử dụng</option>
              </select>
            </div>

            <PopoverClose asChild>
              <Button onClick={handleApply}>Áp dụng</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
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

        {isFiltered && !loading ? (
          <Button variant="outline" onClick={handleResetAll}>
            <XCircle className="w-4 h-4" />
            Xóa
          </Button>
        ) : (
          <Button variant="outline" onClick={onRefresh}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
