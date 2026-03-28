import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/styles/components/ui/button";
import { Input } from "@/src/styles/components/ui/input";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { ProductCategory, Store } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, Search, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  categoryList?: ProductCategory[];
  onSearch: (val: string) => void;
  onApplyFilter: (val: {
    isActive?: boolean;
    order?: string;
    locationId?: string;
    categoryId?: string;
    pageNumber?: number;
  }) => void;
  onRefresh?: () => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  categoryList,
  onSearch,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(query.searchItem ?? "");
  const debouncedSearch = useDebounce(searchInput, 500);

  const [locationValue, setLocationValue] = useState(query.locationId || "");
  const debouncedLocation = useDebounce(locationValue, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedLocation !== query.locationId) {
      onApplyFilter({
        locationId: debouncedLocation || undefined,
        pageNumber: 1,
      });
    }
  }, [debouncedLocation]);

  const [tempFilter, setTempFilter] = useState<{
    isActive?: boolean;
    categoryId: string;
    pageNumber: number;
  }>({
    isActive: undefined,
    categoryId: query.categoryId ?? "",
    pageNumber: query.pageNumber ?? 1,
  });

  const isFiltered =
    query.searchItem || query.categoryId !== "" || query.isActive !== undefined;

  const handleApply = () => {
    onApplyFilter({
      isActive: tempFilter.isActive,
      categoryId: tempFilter.categoryId || undefined,
    });
  };

  const handleResetAll = () => {
    setSearchInput("");
    setTempFilter({
      isActive: undefined,
      categoryId: "",
      pageNumber: 1,
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
            {/* Category */}
            <div className="grid gap-2">
              <Label>Danh mục</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.categoryId}
                onChange={(e) =>
                  setTempFilter((p) => ({ ...p, categoryId: e.target.value }))
                }
              >
                <option value="">Tất cả</option>
                {categoryList?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
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
