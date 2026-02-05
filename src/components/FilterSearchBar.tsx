"use client";

import { useEffect, useState } from "react";
import { Input } from "../styles/components/ui/input";
import { Button } from "../styles/components/ui/button";
import { Filter } from "lucide-react";
import { Label } from "../styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../styles/components/ui/popover";
import { Slider } from "../styles/components/ui/slider";
import { useDebounce } from "../hooks/useDebounce";
import { PopoverClose } from "@radix-ui/react-popover";

interface FiltersSearchProps<TStatus extends string = string> {
  tempFilter: {
    order: string;
    status: TStatus | "";
    limit: number;
  };
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onLimitChange: (value: number) => void;
  onApplyFilters: () => void;
  query: { search: string };
  updateQuery: (update: { search?: string }) => void;
  searchPlaceholder?: string;
  reset: () => void;
  selectStatusData?: {
    label: string;
    value: TStatus;
  }[];
}

export default function FilterSearchBar<TStatus extends string = string>({
  tempFilter,
  onFilterChange,
  onLimitChange,
  onApplyFilters,
  query,
  updateQuery,
  reset,
  searchPlaceholder,
  selectStatusData,
}: FiltersSearchProps<TStatus>) {
  const [searchInput, setSearchInput] = useState<string>(
    query.search as string,
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    updateQuery({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleLimitChange = (value: number[]) => {
    onLimitChange(value[0]); // gọi parent để update state
  };

  const isChanged =
    query.search != "" || tempFilter.order !== "" || tempFilter.status !== "";

  const handleResetQuery = () => {
    reset();
    setSearchInput("");
  };

  return (
    <div className="inline-flex items-center gap-3">
      {/* Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter /> Bộ lọc
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start">
          <div className="grid gap-4">
            {/* Sort */}
            <div className="grid gap-2">
              <Label>Sắp xếp</Label>
              <select
                className="border rounded-md h-9 px-2"
                name="order"
                value={tempFilter.order}
                onChange={onFilterChange}
              >
                <option value="">Sắp xếp</option>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div className="grid gap-2">
              <Label>Trạng thái</Label>
              <select
                className="border rounded-md h-9 px-2"
                name="status"
                value={tempFilter.status}
                onChange={onFilterChange}
              >
                <option value="">Tất cả</option>
                {selectStatusData?.map((status) => (
                  <option
                    key={String(status.value)}
                    value={String(status.value)}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Giới hạn */}
            <div className="grid gap-3">
              <Label>Giới hạn mỗi trang: {tempFilter.limit}</Label>
              <Slider
                value={[tempFilter.limit]}
                max={50}
                step={1}
                onValueChange={handleLimitChange} // gọi parent
              />
            </div>

            <PopoverClose asChild>
              <Button className="w-full mt-2" onClick={onApplyFilters}>
                Áp dụng bộ lọc
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      {/* Tìm kiếm */}
      <Input
        type="text"
        placeholder="Tìm kiếm"
        className="w-[250px]"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {isChanged && (
        <span className="cursor-pointer" onClick={() => handleResetQuery()}>
          Xóa
        </span>
      )}
    </div>
  );
}
