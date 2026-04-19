// import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/styles/components/ui/button";
import { Input } from "@/src/styles/components/ui/input";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, Search, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  onApplyFilter: (val: { status?: string }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [tempFilter, setTempFilter] = useState<{
    status: string;
  }>({
    status: String(query.status ?? ""),
  });

  const isFiltered = query.status !== "";

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: "",
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
                <option value="Pending">Đang chờ</option>
                <option value="Approved">Đã chấp nhận</option>
                <option value="Rejected">Đã từ chối</option>
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
