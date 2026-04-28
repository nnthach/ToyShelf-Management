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
  Calendar,
  CircleDollarSign,
  Clock,
  CreditCard,
  Package,
  Receipt,
  ShoppingBag,
  Store,
  Tag,
  User,
  UserSquare2,
} from "lucide-react";
import {
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetailPartnerAPI } from "@/src/services/order.service";
import Image from "next/image";
import { RefillRequestProductColor } from "@/src/types";

type OrderDetailModalProps = {
  orderCode: number;
  isOpen: boolean;
  onClose: () => void;
};

function OrderDetailModal({
  orderCode,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  const { data: orderDetail, isLoading } = useQuery({
    queryKey: ["orderPartner", orderCode],
    queryFn: () => getOrderDetailPartnerAPI(orderCode),
    select: (res) => res.data,
    enabled: !!orderCode && isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[950px] h-[90vh] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-950">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <Receipt className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Chi tiết đơn hàng #{orderCode}
              </DialogTitle>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">
                ID: {orderDetail?.id}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border ${formatOrderStatusColor(orderDetail?.status || "")}`}
          >
            {formatOrderStatusText(orderDetail?.status || "") || "N/A"}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="h-[500px] flex items-center justify-center text-slate-400 italic">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full max-h-[80vh] overflow-hidden">
            {/* CỘT TRÁI: THÔNG TIN CHUNG (4/12) */}
            <div className="lg:col-span-6 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Cửa hàng & Đối tác */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-2">
                  <Store size={14} /> Cửa hàng & Đối tác
                </h3>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 shadow-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Cửa hàng</span>
                    <span className="text-sm font-bold">
                      {orderDetail?.storeName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Đối tác</span>
                    <span className="text-sm font-bold text-blue-600">
                      {orderDetail?.partnerName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Khách hàng & Nhân viên */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-2">
                  <User size={14} /> Nhân viên bán hàng & Khách hàng
                </h3>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">
                        Khách hàng
                      </p>
                      <p className="text-sm font-bold">
                        {orderDetail?.customerName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {orderDetail?.customerEmail}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-50 flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <UserSquare2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">
                        Nhân viên bán hàng
                      </p>
                      <p className="text-sm font-bold">
                        {orderDetail?.staffName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {orderDetail?.staffEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thanh toán */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-2">
                  <CreditCard size={14} /> Thanh toán & Thời gian
                </h3>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 shadow-sm grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      Phương thức
                    </p>
                    <p className="text-sm font-bold">
                      {orderDetail?.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      Mã tham chiếu
                    </p>
                    <p className="text-sm font-bold break-all">
                      {orderDetail?.bankReference || "---"}
                    </p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-50 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-600">
                      {orderDetail?.createdAt
                        ? new Date(orderDetail.createdAt).toLocaleString(
                            "vi-VN",
                          )
                        : "---"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Totals */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
                  <span className="text-sm font-medium opacity-90">
                    Tổng đơn hàng
                  </span>
                  <span className="text-lg font-bold">
                    {orderDetail?.totalAmount?.toLocaleString()}₫
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck size={18} />
                    <span className="text-sm font-medium opacity-90">
                      Tổng hoa hồng
                    </span>
                  </div>
                  <span className="text-lg font-bold">
                    {orderDetail?.totalCommission?.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM (7/12) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-950 flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <ShoppingBag size={16} className="text-blue-600" />
                  Sản phẩm ({orderDetail?.items?.length || 0})
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-3">
                  {orderDetail?.items?.map(
                    (item: RefillRequestProductColor, index: number) => (
                      <div
                        key={index}
                        className="group flex gap-4 p-3 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/20 transition-all"
                      >
                        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                          {item?.imageUrl ? (
                            <Image
                              src={item?.imageUrl}
                              alt={item?.productName || "N/A"}
                              fill
                              className="object-cover p-1 group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                              {item?.productName || "N/A"}
                            </h4>
                            <p className="text-[10px] font-mono text-slate-400 uppercase">
                              {item?.sku || "N/A"}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                            <div className="flex flex-col gap-1.5">
                              <p className="text-xs text-slate-500 flex items-center">
                                {item?.price?.toLocaleString()}₫
                                <span className="mx-1 opacity-50">×</span>
                                <b className="text-slate-700 dark:text-slate-300">
                                  {item?.quantity}
                                </b>
                              </p>

                              <div className="inline-flex items-center w-fit px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold leading-none">
                                Hoa hồng:{" "}
                                {((item?.commissionRate || 0) * 100).toFixed(0)}
                                %
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 items-end">
                              <p className="text-xs font-bold text-slate-900 leading-none">
                                {(item?.subTotal || 0).toLocaleString()}₫
                              </p>
                              <p className="text-sm font-semibold text-emerald-600 leading-none">
                                +
                                {(item?.commissionAmount || 0).toLocaleString()}
                                ₫
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full lg:w-32 font-bold text-slate-500"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetailModal;
