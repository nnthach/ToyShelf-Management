"use client";

import { useEffect, useState } from "react";
import { Input } from "@/styles/components/ui/input";
import { Button } from "@/styles/components/ui/button";
import { Filter } from "lucide-react";
import { Label } from "@/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/styles/components/ui/popover";
import { Slider } from "@/styles/components/ui/slider";
import { useDebounce } from "hooks/useDebounce";
import { PopoverClose } from "@radix-ui/react-popover";

interface UserFiltersProps {
  tempFilter: {
    order: string;
    status: string;
    limit: number;
  };
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onLimitChange: (value: number) => void;
  onApplyFilters: () => void;
  query: { search: string };
  updateQuery: (update: { search?: string }) => void;
  reset: () => void;
}

export default function FilterSearchBar({
  tempFilter,
  onFilterChange,
  onLimitChange,
  onApplyFilters,
  query,
  updateQuery,
  reset,
}: UserFiltersProps) {
  const [searchInput, setSearchInput] = useState<string>(
    query.search as string
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
    <div className="flex items-center gap-3">
      {/* Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <Filter /> Filter
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start">
          <div className="grid gap-4">
            {/* Sort */}
            <div className="grid gap-2">
              <Label>Sort by Full Name</Label>
              <select
                className="border rounded-md h-9 px-2"
                name="order"
                value={tempFilter.order}
                onChange={onFilterChange}
              >
                <option value="">Sort</option>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label>Status</Label>
              <select
                className="border rounded-md h-9 px-2"
                name="status"
                value={tempFilter.status}
                onChange={onFilterChange}
              >
                <option value="">All</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING_VERIFICATION">
                  Pending Verification
                </option>
                <option value="inactive">Banned</option>
              </select>
            </div>

            {/* Limit */}
            <div className="grid gap-3">
              <Label>Limit per page: {tempFilter.limit}</Label>
              <Slider
                value={[tempFilter.limit]}
                max={50}
                step={1}
                onValueChange={handleLimitChange} // gọi parent
              />
            </div>

            <PopoverClose asChild>
              <Button className="w-full mt-2" onClick={onApplyFilters}>
                Apply Filters
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search */}
      <Input
        type="text"
        placeholder="Search email"
        className="w-[250px]"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {isChanged && (
        <span className="cursor-pointer" onClick={() => handleResetQuery()}>
          Clear
        </span>
      )}
    </div>
  );
}
