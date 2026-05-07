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
    partnerId?: string;
  }) => void;
  onReset: () => void;
  onRefresh?: () => void;
};

export default function FilterSearch({
  query,
  loading,
  showStatus = true,
  showPartner = true,
  onApplyFilter,
  onReset,
  onRefresh,
}: FilterBarProps) {
  const [tempFilter, setTempFilter] = useState<{
    status?: string;
    partnerId: string;
  }>({
    status: query.status as string | undefined,
    partnerId: query.partnerId ?? "",
  });

  const isFiltered =
    (showStatus && query.status !== undefined && query.status !== "") ||
    (showPartner && query.partnerId !== undefined && query.partnerId !== "");

  const handleApply = () => {
    onApplyFilter({
      status: tempFilter.status || undefined,
      partnerId: tempFilter.partnerId || undefined,
    });
  };

  const handleResetAll = () => {
    setTempFilter({
      status: undefined,
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
