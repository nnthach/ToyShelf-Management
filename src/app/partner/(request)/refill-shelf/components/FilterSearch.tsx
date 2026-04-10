// import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/styles/components/ui/button";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { Store } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  storeList?: Store[];
  onApplyFilter: (val: {
    status?: string;
    order?: string;
    storeId?: string;
  }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  onApplyFilter,
  onReset,
  storeList,
  onRefresh,
}: FilterBarProps) {
  const [storeValue, setStoreValue] = useState(query.storeId || "");
  const debouncedStore = useDebounce(storeValue, 500);

  useEffect(() => {
    onApplyFilter({
      storeId: debouncedStore || undefined,
    });
  }, [debouncedStore]);

  const [tempFilter, setTempFilter] = useState<{
    status: string;
    order: string;
  }>({
    status: String(query.status ?? ""),
    order: query.order ?? "",
  });

  const isFiltered =
    query.order !== "" || query.status !== "" || query.storeId !== "";

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status || undefined,
      order: tempFilter.order || undefined,
    });
  };

  const handleResetAll = () => {
    setStoreValue("");
    setTempFilter({
      status: "",
      order: "",
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
                <option value="Pending">Đang chờ duyệt</option>
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

      <select
        className="border rounded-md h-9 px-2"
        value={storeValue}
        onChange={(e) => setStoreValue(e.target.value)}
      >
        <option value={""}>Tất cả cửa hàng</option>
        {storeList?.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

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
