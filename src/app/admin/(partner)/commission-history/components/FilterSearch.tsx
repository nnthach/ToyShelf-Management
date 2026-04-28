import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/styles/components/ui/button";
import { Input } from "@/src/styles/components/ui/input";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { Partner, Store } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";

import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, RotateCcw, Search, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  partnerList: Partner[];
  storeList: Store[];
  onSearch: (val: string) => void;
  onApplyFilter: (val: {
    pageNumber?: number;
    pageSize?: number;
    partnerId?: string;
    fromDate?: string;
    toDate?: string;
    storeId?: string;
  }) => void;
  onReset: () => void;
  onRefresh?: () => void;
};

export default function FilterSearch({
  query,
  loading,
  partnerList,
  storeList,
  onSearch,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(query.keyword ?? "");
  const debouncedSearch = useDebounce(searchInput, 500);

  const [partnerValue, setPartnerValue] = useState(query.partnerId || "");
  const debouncedPartner = useDebounce(partnerValue, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedPartner !== query.partnerId) {
      onApplyFilter({
        partnerId: debouncedPartner || undefined,
        pageNumber: 1,
      });
    }
  }, [debouncedPartner]);

  const [tempFilter, setTempFilter] = useState<{
    pageSize: number;
    pageNumber: number;
    storeId?: string;
    fromDate?: string;
    toDate?: string;
  }>({
    pageSize: query.pageSize ?? 10,
    pageNumber: query.pageNumber ?? 1,
    storeId: query.storeId || undefined,
    fromDate: query.fromDate || undefined,
    toDate: query.toDate || undefined,
  });

  const isFiltered =
    query.keyword ||
    query.pageSize !== 10 ||
    query.storeId ||
    query.fromDate ||
    query.toDate;

  const handleApply = () => {
    onApplyFilter({
      pageSize: tempFilter.pageSize || 10,
      storeId: tempFilter.storeId || undefined,
      fromDate: tempFilter.fromDate || undefined,
      toDate: tempFilter.toDate || undefined,
    });
  };

  const handleResetAll = () => {
    setSearchInput("");
    setTempFilter({
      pageNumber: 1,
      pageSize: 10,
      storeId: undefined,
      fromDate: undefined,
      toDate: undefined,
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
            {/* Page Size */}
            <div className="grid gap-2">
              <Label>Hiển thị</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.pageSize}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    pageSize: Number(e.target.value),
                  }))
                }
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Store ID */}
            <div className="grid gap-2">
              <Label>Cửa hàng</Label>
              <select
                className="border rounded-md h-9 px-2"
                value={tempFilter.storeId}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    storeId: e.target.value || undefined,
                  }))
                }
              >
                <option value="">Tất cả</option>
                {storeList?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div className="grid gap-2">
              <Label>Từ ngày</Label>
              <Input
                type="date"
                value={tempFilter.fromDate}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    fromDate: e.target.value || undefined,
                  }))
                }
              />
            </div>

            {/* To Date */}
            <div className="grid gap-2">
              <Label>Đến ngày</Label>
              <Input
                type="date"
                value={tempFilter.toDate}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    toDate: e.target.value || undefined,
                  }))
                }
              />
            </div>

            <PopoverClose asChild>
              <Button onClick={handleApply}>Áp dụng</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      {/*partner id */}
      <select
        className="border rounded-md h-9 px-2"
        value={partnerValue}
        onChange={(e) => setPartnerValue(e.target.value)}
      >
        <option value="">Chọn đối tác</option>
        {partnerList?.map((p) => (
          <option key={p.id} value={p.id}>
            {p.companyName}
          </option>
        ))}
      </select>

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
