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
  storeOptions?: { label: string; value: string }[];
  onApplyFilter: (val: {
    storeId?: string;
    storeRole?: string;
    isActive?: boolean;
  }) => void;
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
    storeId: string;
    isActive?: boolean;
    storeRole: string;
  }>({
    isActive: undefined,
    storeId: query.storeId ?? "",
    storeRole: query.storeRole ?? "",
  });

  const isFiltered =
    query.storeId !== "" ||
    query.storeRole !== "" ||
    query.isActive !== undefined;

  const handleApply = () => {
    onApplyFilter({
      isActive: tempFilter.isActive,
      storeId: tempFilter.storeId || undefined,
      storeRole: tempFilter.storeRole || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      isActive: undefined,
      storeId: "",
      storeRole: "",
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

            {/*role */}
            <div className="grid gap-2">
              <Label>Chức vụ</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.storeRole}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    storeRole: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                <option value="Manager">Quản lý cửa hàng</option>
                <option value="Staff">Nhân viên cửa hàng</option>
              </select>
            </div>

            {/*isactive */}
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
