"use client";

import { Card, CardHeader } from "@/src/styles/components/ui/card";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";
import {
  CheckCircle2,
  DollarSign,
  Eye,
  MinusCircle,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/src/styles/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMonthlySettlementDetailAPI,
  updateMonthlySettlementBankedAPI,
} from "@/src/services/monthly-settlement.service";
import { useState } from "react";
import {DailySummary } from "@/src/types";
import {
  formatMonthlySettlementStatusColor,
  formatMonthlySettlementStatusText,
} from "@/src/utils/formatStatus";
import DeductionModal from "./DeductionModal";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import OrderInDayModal from "./OrderInDayModal";
import { set } from "zod";

function ViewDetailSheet({
  monthlySettlementId,
}: {
  monthlySettlementId: string;
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [isOpenDeduction, setIsOpenDeduction] = useState(false);

  const [isOpenOrderInDay, setIsOpenOrderInDay] = useState(false);
  const [orderInDayData, setOrderInDayData] = useState<
    DailySummary | null
  >(null);

  const { data: detail, isLoading } = useQuery({
    queryKey: ["monthlySettlement", monthlySettlementId],
    queryFn: () => getMonthlySettlementDetailAPI(monthlySettlementId),
    select: (res) => res.data,
    enabled: !!monthlySettlementId && open,
  });

  const paidMutation = useMutation({
    mutationFn: updateMonthlySettlementBankedAPI,
    onSuccess: () => {
      toast.success("Xác nhận chuyển tiền thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["monthlySettlement", monthlySettlementId],
      });

      queryClient.invalidateQueries({
        queryKey: ["monthlySettlements"],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Xác nhận chuyển tiền thất bại"));
    },
  });

  const handlePaid = (monthlySettlementId: string) => {
    const confirmPaid = window.confirm("Bạn có chắc đã chuyển tiền không?");

    if (!confirmPaid) return;

    paidMutation.mutate(monthlySettlementId);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          title="Xem chi tiết"
          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors group"
        >
          <Eye size={20} className="text-blue-500 group-hover:text-blue-600" />
        </button>
      </SheetTrigger>

      <SheetContent className="w-full !max-w-[1050px] flex flex-col p-0 border-l-0 shadow-2xl">
        {/* HEADER - Hiện đại và sạch sẽ */}
        <SheetHeader className="px-8 pt-8 pb-6 border-b bg-white dark:bg-slate-950 flex-none">
          <div className="space-y-1">
            <SheetTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Chi tiết Đối soát hoa hồng
            </SheetTitle>
            <SheetDescription className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-widest border border-blue-100 dark:border-blue-800">
                {detail?.partnerCode}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-700 dark:text-slate-300">
                {detail?.partnerName}
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Tháng {detail?.month}/{detail?.year}
              </span>
            </SheetDescription>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-50/50">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium animate-pulse">
              Đang truy xuất dữ liệu...
            </p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden bg-slate-50/50 dark:bg-slate-950">
            {/* CỘT TRÁI - Lịch sử giao dịch (62%) */}
            <div className="w-[62%] flex flex-col p-6 pt-0 pr-3 overflow-hidden">
              {/* Stats Quick Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6 flex-none">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Tổng đơn
                    </p>
                    <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {detail?.totalItems ?? 0}{" "}
                      <span className="text-xs font-medium text-slate-500 ml-0.5">
                        đơn
                      </span>
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Doanh thu
                    </p>
                    <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {detail?.totalSalesAmount?.toLocaleString("vi-VN")}
                      <span className="text-xs font-medium text-slate-500 ml-1">
                        ₫
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction List Container */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-none mb-3 px-1">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    Chi tiết giao dịch từng ngày
                  </h3>
                </div>
                <div className="flex-1 min-h-0 border border-slate-200/60 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                  <ScrollArea className="h-full w-full">
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                      {detail?.dailySummaries?.map((h: DailySummary) => (
                        <div
                          key={h.date}
                          onClick={() => {
                            setOrderInDayData(h);
                            setIsOpenOrderInDay(true);
                          }}
                          className="group flex cursor-pointer items-center gap-6 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all border-b border-slate-100/50 dark:border-slate-800 last:border-0 cursor-default"
                        >
                          {/* Phần 1: Thời gian (Ngày) */}
                          <div className="flex-none flex flex-col min-w-[85px]">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              Ngày
                            </span>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {new Date(h.date).toLocaleDateString("vi-VN")}
                            </span>
                          </div>

                          {/* Phần 2: Thống kê số lượng */}
                          <div className="flex-1 min-w-0 grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-medium text-slate-500 uppercase">
                                Đơn hàng
                              </span>
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {h.totalOrders}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-medium text-slate-500 uppercase">
                                Sản phẩm
                              </span>
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {h.totalProductsSold}
                              </span>
                            </div>
                          </div>

                          {/* Phần 3: Tài chính (Doanh số & Hoa hồng) */}
                          <div className="text-right flex-none">
                            <div className="flex flex-col items-end">
                              <span className="text-[15px] font-black text-green-600 dark:text-green-500 tabular-nums">
                                Hoa hồng:{" "}
                                {h.totalCommissionAmount.toLocaleString(
                                  "vi-VN",
                                )}
                                ₫
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">
                                Doanh thu:{" "}
                                {h.totalSalesAmount.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!detail?.dailySummaries ||
                        detail.dailySummaries.length === 0) && (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                          <Package size={40} className="opacity-10 mb-2" />
                          <p className="text-xs font-medium uppercase tracking-widest">
                            Không có dữ liệu
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI - Tài chính & Tổng kết (38%) */}
            <div className="flex-1 bg-white dark:bg-slate-950 border-l border-slate-200/60 dark:border-slate-800 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 pt-0 space-y-4">
                  {/* Đối tác Section */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-500 rounded-full" />
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Thông tin đối tác
                      </h4>
                    </div>
                    <div className="grid gap-3 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">
                          Mã đối tác
                        </span>
                        <span className="text-sm font-mono font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                          {detail?.partnerCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">
                          Trạng thái kỳ
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1 ring-inset ${formatMonthlySettlementStatusColor(detail?.status || "")}`}
                        >
                          {formatMonthlySettlementStatusText(
                            detail?.status || "",
                          )}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Tài chính Section */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-green-500 rounded-full" />
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Chi tiết thanh toán
                      </h4>
                    </div>
                    <div className="space-y-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Tổng doanh thu</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {detail?.totalSalesAmount?.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">
                            Tổng hoa hồng (A)
                          </span>
                          <span className="font-bold text-blue-600">
                            +
                            {detail?.totalCommissionAmount?.toLocaleString(
                              "vi-VN",
                            )}
                            ₫
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Khấu trừ (B)</span>
                          <span className="font-bold text-red-500">
                            -{detail?.deductionAmount?.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-dashed border-slate-200 dark:border-slate-800">
                        <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 p-5 rounded-2xl relative overflow-hidden">
                          <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full blur-2xl" />
                          <div className="relative flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-bold uppercase text-green-700/70 dark:text-green-400/70 tracking-[0.15em] mb-1.5">
                                Thực nhận
                              </p>
                              <p className="text-2xl font-black text-green-600 dark:text-green-400 tabular-nums tracking-tight">
                                {detail?.finalAmount?.toLocaleString("vi-VN")}
                                <span className="text-sm font-medium ml-1.5 opacity-80">
                                  ₫
                                </span>
                              </p>
                            </div>
                          </div>
                          <p className="text-[9px] text-green-600/50 dark:text-green-400/40 font-medium mt-2 italic">
                            * Số tiền đã bao gồm các khoản khấu trừ và thuế (nếu
                            có)
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Ghi chú Section */}
                  {detail?.note && (
                    <section className="space-y-3">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Ghi chú
                      </h4>
                      <div className="relative p-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-xl" />
                        <p className="text-sm text-amber-900 dark:text-amber-200 italic leading-relaxed">
                          {detail.note}
                        </p>
                      </div>
                    </section>
                  )}
                </div>
              </div>
              {detail && detail?.status === "PENDING" && (
                <SheetFooter className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-transparent flex-none">
                  <div className="flex items-center gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpenDeduction(true)}
                      className="flex-1 h-11 font-bold rounded-xl "
                    >
                      <MinusCircle size={18} strokeWidth={2.5} />
                      Khấu trừ
                    </Button>

                    <Button
                      variant="success"
                      disabled={paidMutation.isPending}
                      onClick={() => handlePaid(detail.id)}
                      className="flex-[1.5] h-11 font-bold rounded-xl"
                    >
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                      Xác nhận đã chuyển tiền
                    </Button>
                  </div>
                </SheetFooter>
              )}
            </div>
          </div>
        )}

        <DeductionModal
          monthlySettlementId={monthlySettlementId}
          isOpen={isOpenDeduction}
          onClose={() => setIsOpenDeduction(false)}
        />

        <OrderInDayModal
          data={orderInDayData}
          isOpen={isOpenOrderInDay}
          onClose={() => {
            setIsOpenOrderInDay(false);
            setOrderInDayData(null);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
