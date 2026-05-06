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
import {
  BadgeCheck,
  Calculator,
  CircleDollarSign,
  Clock,
  Package,
  Tag,
} from "lucide-react";
import { DailySummary } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";
import { useState } from "react";
import OrderDetailModal from "./OrderDetailModal";

type OrderInDayModalProps = {
  data: DailySummary | null;
  isOpen: boolean;
  onClose: () => void;
};

function OrderInDayModal({ data, isOpen, onClose }: OrderInDayModalProps) {
  const [isOpenOrderDetail, setIsOpenOrderDetail] = useState(false);
  const [orderCode, setOrderCode] = useState<number | null>(null);

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
        <div className="px-2 py-2">
          <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {data && data.transactions.length > 0 ? (
              <div className="space-y-3 p-2">
                {data.transactions.map((item) => (
                  <div
                    key={item.id}
                    className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl hover:ring-2 hover:ring-blue-500/10 transition-all shadow-sm"
                    onClick={() => {
                      setOrderCode(item.orderCode);
                      setIsOpenOrderDetail(true);
                    }}
                  >
                    {/* Header: Mã đơn & Thời gian */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg">
                          <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Mã đơn hàng
                          </p>
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                            #{item?.orderCode}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-slate-400 justify-end mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-medium">
                            {formatDateTime(item.orderDate).full ||
                              "--:-- --/--/----"}
                          </span>
                        </div>
                        {/* Status Badge */}
                        <span
                          className={`${formatOrderStatusColor(item?.status)} inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase`}
                        >
                          {formatOrderStatusText(item?.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50 dark:border-slate-800">
                      {/* Tổng giá trị đơn */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <CircleDollarSign className="w-3 h-3" />
                          <span>Tổng tiền</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {item?.totalAmount?.toLocaleString("vi-VN") || 0}₫
                        </p>
                      </div>

                      {/* Hoa hồng */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1 text-[11px] text-green-600 justify-end">
                          <BadgeCheck className="w-3 h-3" />
                          <span>Hoa hồng</span>
                        </div>
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                          +{item?.totalCommission?.toLocaleString("vi-VN") || 0}
                          ₫
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-400 text-sm italic">
                  Không tìm thấy dữ liệu giao dịch
                </p>
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

        <OrderDetailModal
          orderCode={orderCode || 0}
          isOpen={isOpenOrderDetail}
          onClose={() => {
            setIsOpenOrderDetail(false);
            setOrderCode(null);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default OrderInDayModal;
