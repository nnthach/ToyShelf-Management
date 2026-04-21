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
  onApplyFilter: (val: { isActive?: boolean; roleBusiness?: string }) => void;
  onReset: () => void;
  onRefresh?: () => void;
};

export default function FilterSearch({
  query,
  loading,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [tempFilter, setTempFilter] = useState<{
    isActive?: boolean;
    roleBusiness?: string;
  }>({
    isActive: undefined,
    roleBusiness: query.roleBusiness ?? "",
  });

  const isFiltered = query.isActive !== undefined || query.roleBusiness !== "";

  const handleApply = () => {
    onApplyFilter({
      isActive: tempFilter.isActive,
      roleBusiness: tempFilter.roleBusiness || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      isActive: undefined,
      roleBusiness: "",
    });
    onReset();
  };

  const systemBusinessRoles = [
    { value: "warehouse_shipper", label: "Nhân viên giao hàng" },
    { value: "warehouse_manager", label: "Quản lý kho" },
    { value: "partner_staff", label: "Nhân viên cửa hàng" },
    { value: "partner_manager", label: "Quản lý cửa hàng" },
    { value: "partner_admin", label: "Đối tác" },
    { value: "customer", label: "Quản trị viên" },
  ];

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
            {/* Role */}
            <div className="grid gap-2">
              <Label>Chức vụ</Label>
              <select
                className="border rounded-md h-9 px-2 w-full max-w-full truncate"
                value={tempFilter.roleBusiness}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    roleBusiness: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                {systemBusinessRoles?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

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
