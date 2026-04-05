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
  showStatus?: boolean;
  showOrder?: boolean;
  onApplyFilter: (val: {
    status?: boolean;
    order?: string;
    limit?: number;
  }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  showStatus = true,
  showOrder = true,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {


  const [tempFilter, setTempFilter] = useState<{
    status: "" | "true" | "false";
    order: string;
    limit: number;
  }>({
    status:
      query.status === true ? "true" : query.status === false ? "false" : "",
    order: query.order ?? "",
    limit: query.limit ?? 10,
  });

  const isFiltered =
    (showOrder && query.order !== "") ||
    (showStatus && typeof query.status === "boolean");

  const handleApply = () => {
    onApplyFilter({
      status:
        tempFilter.status === "" ? undefined : tempFilter.status === "true",
      order: tempFilter.order || undefined,
      limit: tempFilter.limit,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: "",
      order: "",
      limit: 10,
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
            {/* Order */}
            {showOrder && (
              <div className="grid gap-2">
                <Label>Sắp xếp</Label>
                <select
                  className="border rounded-md h-9 px-2"
                  value={tempFilter.order}
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      order: e.target.value,
                    }))
                  }
                >
                  <option value="">Tất cả</option>
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </div>
            )}

            {/* Status */}
            {showStatus && (
              <div className="grid gap-2">
                <Label>Trạng thái</Label>
                <select
                  className="border rounded-md h-9 px-2"
                  value={tempFilter.status}
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      status: e.target.value as "" | "true" | "false",
                    }))
                  }
                >
                  <option value="">Tất cả</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            )}

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
