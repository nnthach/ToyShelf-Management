// import { LoadingSpinner } from "@/components/LoadingSpinner";
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
  onApplyFilter: (val: { status?: string; type?: string }) => void;
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
    status?: string;
    type?: string;
  }>({
    status: String(query.status) ?? "",
    type: query.type ?? "",
  });

  const isFiltered = query.type !== "" || query.status !== "";

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status || undefined,
      type: tempFilter.type || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: "",
      type: "",
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

        <PopoverContent align="start" className="w-72">
          <div className="grid gap-4">
            {/* Type */}
            <div className="grid gap-2">
              <Label>Loại đơn</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.type}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    type: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                <option value="Delivery">Giao hàng</option>
                <option value="Return">Trả hàng</option>
                <option value="Combined">Hỗn hợp</option>
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
                <option value="Pending">Đang chờ</option>
                <option value="Assigned">Đã điều phối giao hàng</option>
                <option value="Accepted">Nhân viên giao hàng chấp nhận</option>
                <option value="Rejected">Đã từ chối</option>
                <option value="InProgress">Đang giao hàng</option>
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
