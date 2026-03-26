import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/styles/components/ui/button";
import { Input } from "@/src/styles/components/ui/input";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { City, Partner } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, Search, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  cityList: City[];
  onSearch: (val: string) => void;
  onApplyFilter: (val: {
    isActive?: boolean;
    cityId?: string;
  }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  cityList,
  onSearch,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(query.keyword ?? "");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  const [tempFilter, setTempFilter] = useState<{
    isActive?: boolean;
    cityId: string;
  }>({
    isActive: undefined,
    cityId: query.cityId ?? "",
  });

  const isFiltered =
    query.keyword ||
    query.cityId !== "" ||
    query.isActive !== undefined;

  const handleApply = () => {
    onApplyFilter({
      isActive: tempFilter.isActive,
      cityId: tempFilter.cityId || undefined,
    });
  };

  const handleResetAll = () => {
    setSearchInput("");
    setTempFilter({
      isActive: undefined,
      cityId: "",
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
      
            {/* City ID */}
            <div className="grid gap-2">
              <Label>Thành phố</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.cityId}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    cityId: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                {cityList?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

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

      {/* SEARCH */}
      <div className="relative w-[250px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={loading}
          className="pl-9 pr-8"
        />
        {searchInput && !loading && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

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
