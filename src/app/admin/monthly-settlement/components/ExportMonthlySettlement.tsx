"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { Label } from "@/src/styles/components/ui/label"; // Đảm bảo có import Label
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Download, FileText, Upload, XCircle } from "lucide-react";
import { useState } from "react";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { exportMonthlySettlementAPI } from "@/src/services/monthly-settlement.service";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { Partner } from "@/src/types";

type ExportMonthlySettlementProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ExportMonthlySettlement({
  isOpen,
  onClose,
}: ExportMonthlySettlementProps) {
  // Quản lý state local cho form
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    partnerId: "",
    status: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy danh sách đối tác
  const { data: partnerList = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllPartnerAPI({}),
    select: (res) => res.data,
    enabled: isOpen,
  });

  const handleExport = async () => {
    setIsSubmitting(true);
    try {
      const blob = await exportMonthlySettlementAPI(filters); // ✅ blob trực tiếp

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `ChotSo_Thang${filters.month}_Nam${filters.year}.xlsx`,
      );

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Xuất dữ liệu thành công");
      onClose();
    } catch (error) {
      console.error("Lỗi xuất file:", error);
      toast.error("Không thể mở file. Hãy kiểm tra lại cấu hình API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kiểm tra tính hợp lệ để disable nút
  const isInvalid = !filters.year || !filters.month;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Xuất dữ liệu đối soát
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Vui lòng chọn thời gian để xuất báo cáo
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Year selection */}
          <div className="grid gap-2">
            <Label htmlFor="year">
              Năm <span className="text-red-500">*</span>
            </Label>
            <select
              id="year"
              className="border rounded-md h-9 px-2 text-sm"
              value={filters.year}
              onChange={(e) =>
                setFilters((p) => ({ ...p, year: parseInt(e.target.value) }))
              }
            >
              <option value="">Chọn năm</option>
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

          {/* Month selection */}
          <div className="grid gap-2">
            <Label htmlFor="month">
              Tháng <span className="text-red-500">*</span>
            </Label>
            <select
              id="month"
              className="border rounded-md h-9 px-2 text-sm"
              value={filters.month}
              onChange={(e) =>
                setFilters((p) => ({ ...p, month: parseInt(e.target.value) }))
              }
            >
              <option value="">Chọn tháng</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Partner selection */}
          <div className="grid gap-2">
            <Label>Đối tác</Label>
            <select
              className="border rounded-md h-9 px-2 text-sm w-full"
              value={filters.partnerId}
              onChange={(e) =>
                setFilters((p) => ({ ...p, partnerId: e.target.value }))
              }
            >
              <option value="">Tất cả đối tác</option>
              {partnerList?.map((item: Partner) => (
                <option key={item.id} value={item.id}>
                  {item.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label>Trạng thái</Label>
            <select
              className="border rounded-md h-9 px-2 text-sm w-full outline-none"
              value={filters.status}
              onChange={(e) =>
                setFilters((p) => ({ ...p, status: e.target.value }))
              }
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Đang chờ</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="RECEIVED">Đã nhận tiền</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 gap-2"
          >
            <XCircle className="h-4 w-4" /> Huỷ
          </Button>
          <Button
            onClick={handleExport}
            disabled={isSubmitting || isInvalid}
            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Xuất dữ liệu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExportMonthlySettlement;
