import { Button } from "@/src/styles/components/ui/button";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { PartnerTier } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  partnerTierList?: PartnerTier[];
  onApplyFilter: (val: {
    isActive?: boolean;
    type?: string;
    partnerTierId?: string;
  }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  onApplyFilter,
  onReset,
  onRefresh,
  partnerTierList,
}: FilterBarProps) {
  const [tempFilter, setTempFilter] = useState<{
    isActive?: boolean;
    type?: string;
    partnerTierId?: string;
  }>({
    isActive: undefined,
    type: query.type ?? "",
    partnerTierId: query.partnerTierId ?? "",
  });

  const isFiltered =
    query.isActive !== undefined ||
    query.type !== "" ||
    query.partnerTierId !== "";

  const handleApply = () => {
    onApplyFilter({
      isActive: tempFilter.isActive || undefined,
      type: tempFilter.type || undefined,
      partnerTierId: tempFilter.partnerTierId || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      isActive: undefined,
      type: "",
      partnerTierId: "",
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
            {/* Status */}
            <div className="grid gap-2">
              <Label>Trạng thái</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={
                  tempFilter.isActive === undefined
                    ? "all"
                    : String(tempFilter.isActive)
                }
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    isActive:
                      e.target.value === "all"
                        ? undefined
                        : e.target.value === "true",
                  }))
                }
              >
                <option value="all">Tất cả</option>
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>

            {/* Tier */}
            <div className="grid gap-2">
              <Label>Cấp bậc</Label>
              <select
                className="border rounded-md h-9 px-2 w-full max-w-full truncate"
                value={tempFilter.partnerTierId}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    partnerTierId: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                {partnerTierList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="grid gap-2">
              <Label>Loại</Label>
              <select
                className="border rounded-md h-9 px-2 w-full max-w-full truncate"
                value={tempFilter.type}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    type: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                <option value="Special">Đặc biệt</option>
                <option value="Campaign">Chiến dịch</option>
                <option value="Tier">Thường</option>
              </select>
            </div>

            <PopoverClose asChild>
              <Button onClick={handleApply}>Áp dụng</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      {/* CLEAR */}
      {isFiltered && !loading ? (
        <Button variant="outline" onClick={handleResetAll}>
          <XCircle className="w-4 h-4" />
          Xóa
        </Button>
      ) : (
        <Button variant="outline" onClick={onRefresh}>
          <RotateCcw />
        </Button>
      )}
    </div>
  );
}
