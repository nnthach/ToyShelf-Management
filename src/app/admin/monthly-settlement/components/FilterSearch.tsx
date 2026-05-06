import { getAllPartnerAPI } from "@/src/services/partner.service";
import { Button } from "@/src/styles/components/ui/button";
import { Label } from "@/src/styles/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/styles/components/ui/popover";
import { Partner } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { Filter, RotateCcw, Tags, XCircle } from "lucide-react";
import { useState } from "react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  showStatus?: boolean;
  showMonth?: boolean;
  showYear?: boolean;
  showPartner?: boolean;
  onApplyFilter: (val: {
    status?: string;
    month?: number;
    year?: number;
    partnerId?: string;
  }) => void;
  onReset: () => void;
  onRefresh?: () => void;
};

export default function FilterSearch({
  query,
  loading,
  showStatus = true,
  showMonth = true,
  showYear = true,
  showPartner = true,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [tempFilter, setTempFilter] = useState<{
    status?: string;
    month: number;
    year: number;
    partnerId: string;
  }>({
    status: query.status as string | undefined,
    month: query.month ?? 0,
    year: query.year ?? 0,
    partnerId: query.partnerId ?? "",
  });

  const isFiltered =
    (showStatus && query.status !== undefined && query.status !== "") ||
    (showMonth && query.month !== undefined && query.month !== 0) ||
    (showYear && query.year !== undefined && query.year !== 0) ||
    (showPartner && query.partnerId !== undefined && query.partnerId !== "");

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status || undefined,
      month: tempFilter.month > 0 ? tempFilter.month : undefined,
      year: tempFilter.year > 0 ? tempFilter.year : undefined,
      partnerId: tempFilter.partnerId || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: undefined,
      month: 0,
      year: 0,
      partnerId: "",
    });
    onReset();
  };

  const { data: partnerList } = useQuery({
    queryKey: ["partners", {}],
    queryFn: () => getAllPartnerAPI({}),
    select: (res) => res.data as Partner[],
  });

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

        <PopoverContent align="start">
          <div className="grid gap-4">
            {/* Year */}
            {showYear && (
              <div className="grid gap-2">
                <Label>Năm</Label>
                <select
                  className="border rounded-md h-9 px-2"
                  value={tempFilter.year || ""}
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      year: parseInt(e.target.value) || 0,
                    }))
                  }
                >
                  <option value="">Tất cả</option>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Month */}
            {showMonth && (
              <div className="grid gap-2">
                <Label>Tháng</Label>
                <select
                  className="border rounded-md h-9 px-2"
                  value={tempFilter.month || ""}
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      month: parseInt(e.target.value) || 0,
                    }))
                  }
                >
                  <option value="">Tất cả</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Partner */}
            <div className="grid gap-2">
              <Label>Đối tác</Label>
              <select
                className="border rounded-md h-9 px-2 w-full max-w-full truncate"
                value={tempFilter.partnerId}
                onChange={(e) =>
                  setTempFilter((p) => ({
                    ...p,
                    partnerId: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                {partnerList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.companyName.length > 30
                      ? item.companyName.slice(0, 30) + "…"
                      : item.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            {showStatus && (
              <div className="grid gap-2">
                <Label>Trạng thái</Label>
                <select
                  className="border rounded-md h-9 px-2"
                  value={tempFilter.status || ""}
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      status: e.target.value || undefined,
                    }))
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="PENDING">Đang chờ</option>
                  <option value="FINALIZED">Đã chốt sổ</option>
                  <option value="PAID">Đã thanh toán</option>
                  <option value="RECEIVED">Đã nhận tiền</option>
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
