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
import { useTranslations } from "next-intl";

interface FiltersSearchProps<TStatus extends string = string> {
  tempFilter: {
    order: string;
    status: TStatus | "";
    limit: number;
  };
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
  const tButton = useTranslations("admin.button");
  const t = useTranslations("admin");
  const tFilter = useTranslations("admin.filter");
  const tCommon = useTranslations("common");

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
    <div className="inline-flex items-center gap-3">
      {/* Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter /> {tButton("filter")}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start">
          <div className="grid gap-4">
            {/* Sort */}
            <div className="grid gap-2">
              <Label>{tFilter("sort")}</Label>
              <select
                className="border rounded-md h-9 px-2"
                name="order"
                value={tempFilter.order}
                onChange={onFilterChange}
              >
                <option value="">{tFilter("sort")}</option>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label>{tFilter("status")}</Label>
              <select
                className="border rounded-md h-9 px-2"
                name="status"
                value={tempFilter.status}
                onChange={onFilterChange}
              >
                <option value="">{tCommon("all")}</option>
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

            {/* Limit */}
            <div className="grid gap-3">
              <Label>
                {tFilter("limitPerPage")}: {tempFilter.limit}
              </Label>
              <Slider
                value={[tempFilter.limit]}
                max={50}
                step={1}
                onValueChange={handleLimitChange} // gọi parent
              />
            </div>

            <PopoverClose asChild>
              <Button className="w-full mt-2" onClick={onApplyFilters}>
                {tButton("applyFilter")}
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search */}
      <Input
        type="text"
        placeholder={t("search")}
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
