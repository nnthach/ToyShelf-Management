"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { Calculator, Clock, Package, Tag } from "lucide-react";
import { DailySummary } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";

type OrderInDayModalProps = {
  data: DailySummary | null;
  isOpen: boolean;
  onClose: () => void;
};

function OrderInDayModal({ data, isOpen, onClose }: OrderInDayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0 space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
            <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Chi tiết giao dịch
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-relaxed">
              Danh sách hoa hồng sản phẩm theo từng đơn hàng ngày{" "}
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {data?.date
                  ? new Date(data.date).toLocaleDateString("vi-VN")
                  : "--/--/----"}
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Danh sách giao dịch */}
        <div className="px-2">
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {data && data.transactions.length > 0 ? (
              <div className="space-y-2 pb-4 px-4">
                {data.transactions.map((item) => (
                  <div
                    key={item.id}
                    className="relative group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg">
                          <Package className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          #{item.orderCode}
                        </span>
                        {item.paymentMethod === "QR" && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 uppercase">
                            {item.paymentMethod}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-[11px] font-medium">
                          {formatDateTime(item.orderDate).full || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Tag className="w-3 h-3" />
                          <span>
                            Số lượng:{" "}
                            <b className="text-slate-700 dark:text-slate-300">
                              {item.quantity}
                            </b>
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium italic">
                          Tỷ lệ áp dụng: {(item.appliedRate * 100).toFixed(1)}%
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-green-600 dark:text-green-400">
                          +{item.commissionAmount.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm">
                Không có dữ liệu giao dịch
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full font-bold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
          >
            Đóng cửa sổ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OrderInDayModal;
