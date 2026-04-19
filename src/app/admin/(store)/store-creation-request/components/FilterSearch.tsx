import { Button } from "@/src/styles/components/ui/button";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { Partner } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  partnerList?: Partner[];
  onApplyFilter: (val: { status?: string; partnerId?: string }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  onApplyFilter,
  onReset,
  onRefresh,
  partnerList,
}: FilterBarProps) {
  const [tempFilter, setTempFilter] = useState<{
    status: string;
    partnerId: string;
  }>({
    status: String(query.status) ?? "",
    partnerId: String(query.partnerId) ?? "",
  });

  const isFiltered = query.status !== "" || query.partnerId !== "";

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status || undefined,
      partnerId: tempFilter.partnerId || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: "",
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

        <PopoverContent align="start" className="w-64">
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
