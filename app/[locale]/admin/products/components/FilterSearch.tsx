// import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Button } from "@/shared/styles/components/ui/button";
import { Input } from "@/shared/styles/components/ui/input";
import { Label } from "@/shared/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/styles/components/ui/popover";
import { Slider } from "@/shared/styles/components/ui/slider";
import { QueryParams } from "@/shared/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, Search, X, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  showStatus?: boolean;
  showOrder?: boolean;
  onSearch: (val: string) => void;
  onApplyFilter: (val: {
    status?: boolean;
    order?: string;
    limit?: number;
  }) => void;
  onReset: () => void;
};

export default function FilterSearch({
  query,
  loading,
  showStatus = true,
  showOrder = true,
  onSearch,
  onApplyFilter,
  onReset,
}: FilterBarProps) {
  const tButton = useTranslations("admin.button");
  const tFilter = useTranslations("admin.filter");
  const tCommon = useTranslations("common");
  const t = useTranslations("admin");
  const tStatus = useTranslations("status.user");

  const [searchInput, setSearchInput] = useState(query.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

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
    query.search ||
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
    setSearchInput("");
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
            {tButton("filter")}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-64">
          <div className="grid gap-4">
            {/* Order */}
            {showOrder && (
              <div className="grid gap-2">
                <Label>{tFilter("sort")}</Label>
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
                  <option value="">{tCommon("all")}</option>
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </div>
            )}

            {/* Status */}
            {showStatus && (
              <div className="grid gap-2">
                <Label>{tFilter("status")}</Label>
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
                  <option value="">{tCommon("all")}</option>
                  <option value="true">{tStatus("active")}</option>
                  <option value="false">{tStatus("inactive")}</option>
                </select>
              </div>
            )}

            <PopoverClose asChild>
              <Button onClick={handleApply}>{tButton("applyFilter")}</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      {/* SEARCH */}
      <div className="relative w-[250px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={t("search")}
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
      {isFiltered && !loading && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="
      flex items-center gap-1
      text-blue-600
      hover:text-blue-700
      hover:bg-blue-50
      transition
    "
        >
          <XCircle className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
