import { Button } from "@/src/styles/components/ui/button";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { Partner, Store } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import {
  DamageReportStatusOptions,
  StoreOrderStatusOptions,
} from "@/src/utils/format";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  partnerList?: Partner[];
  storeList?: Store[];
  onApplyFilter: (val: {
    status?: string;
    storeId?: string;
    partnerId?: string;
  }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  storeList,
  partnerList,
  loading,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [tempFilter, setTempFilter] = useState<{
    status: string;
    partnerId: string;
    storeId: string;
  }>({
    status: String(query.status) ?? "",
    partnerId: String(query.partnerId) ?? "",
    storeId: String(query.storeId) ?? "",
  });

  const isFiltered =
    query.status !== "" || query.storeId !== "" || query.partnerId !== "";

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status || undefined,
      storeId: tempFilter.storeId || undefined,
      partnerId: tempFilter.partnerId || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: "",
      storeId: "",
      partnerId: "",
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

        <PopoverContent align="start">
          <div className="grid gap-4">
            {/* Partner */}
            <div className="grid gap-2">
              <Label>Đối tác</Label>
              <select
                className="border rounded-md h-9 px-2 w-full max-w-full truncate"
                value={tempFilter.partnerId}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    partnerId: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                {partnerList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.companyName.length > 30
                      ? item.companyName.slice(0, 30) + "…"
                      : item.companyName}
                  </option>
                ))}
              </select>
            </div>
            {/* Store */}
            <div className="grid gap-2">
              <Label>Cửa hàng</Label>
              <select
                className="border rounded-md h-9 px-2 w-full max-w-full truncate"
                value={tempFilter.storeId}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    storeId: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                {storeList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label>Trạng thái đơn</Label>
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
                {DamageReportStatusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
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
