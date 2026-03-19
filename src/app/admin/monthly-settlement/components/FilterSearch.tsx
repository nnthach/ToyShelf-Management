import { getAllPartnerAPI } from "@/src/services/partner.service";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
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
    (showStatus && query.status !== "") ||
    (showMonth && query.month !== 0) ||
    (showYear && query.year !== 0) ||
    (showPartner && query.partnerId !== "");

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status,
      month: tempFilter.month || undefined,
      year: tempFilter.year || undefined,
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

  const partnerOptions = partnerList?.map((item) => {
    return {
      value: item.id,
      label: item.companyName,
    };
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

        <PopoverContent align="start" className="w-64">
          <div className="grid gap-4">
            {/* Year */}
            {showYear && (
              <div className="grid gap-2">
                <Label>Năm</Label>
                <input
                  type="number"
                  className="border rounded-md h-9 px-2"
                  placeholder="Nhập năm"
                  value={tempFilter.year || ""}
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      year: parseInt(e.target.value) || 0,
                    }))
                  }
                />
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
            {showPartner && (
              <div className="grid gap-2">
                <Label>Đối tác</Label>
                <select
                  className="border rounded-md h-9 px-2"
                  value={
                    tempFilter.status === undefined || tempFilter.status === ""
                      ? "all"
                      : String(tempFilter.status)
                  }
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      status: e.target.value === "all" ? "" : e.target.value,
                    }))
                  }
                >
                  {partnerOptions?.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status */}
            {showStatus && (
              <div className="grid gap-2">
                <Label>Trạng thái</Label>
                <select
                  className="border rounded-md h-9 px-2"
                  value={
                    tempFilter.status === undefined || tempFilter.status === ""
                      ? "all"
                      : String(tempFilter.status)
                  }
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      status: e.target.value === "all" ? "" : e.target.value,
                    }))
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
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
