import { Button } from "@/src/styles/components/ui/button";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  storeOptions?: { label: string; value: string }[];
  onApplyFilter: (val: { status?: string; storeId?: string }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  storeOptions,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [tempFilter, setTempFilter] = useState<{
    status: string;
    storeId: string;
  }>({
    status: String(query.status) ?? "",
    storeId: query.storeId ?? "",
  });

  console.log("store options: ", storeOptions);
  const isFiltered = query.status !== "" || query.storeId !== "";

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status || undefined,
      storeId: tempFilter.storeId || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: "",
      storeId: "",
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
                value={tempFilter.status}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    status: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                <option value="Pending">Đang chờ</option>
                <option value="Accepted">Đã chấp nhận</option>
                <option value="Rejected">Từ chối</option>
                <option value="Expired">Hết hạn</option>
              </select>
            </div>

            {/*store */}
            <div className="grid gap-2">
              <Label>Cửa hàng</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.storeId}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    storeId: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                {storeOptions?.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
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
