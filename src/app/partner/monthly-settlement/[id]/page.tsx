"use client";

import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import {
  finalizeMonthlySettlementAPI,
  getMonthlySettlementDetailAPI,
  receiveMonthlySettlementAPI,
} from "@/src/services/monthly-settlement.service";
import { Badge } from "@/src/styles/components/ui/badge";
import { Button } from "@/src/styles/components/ui/button";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import { DailySummary, Order } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatMonthlySettlementStatusColor,
  formatMonthlySettlementStatusText,
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownToLine,
  ArrowLeft,
  Banknote,
  BarChart3,
  Box,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Info,
  MinusCircle,
  Package,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderDetailModal from "../components/OrderDetailModal";
import ViewOrderDetailSheet from "./components/ViewOrderDetailSheet";

export default function AdminViewMonthlySettlementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpenDeduction, setIsOpenDeduction] = useState(false);
  const [isOpenConfirmPay, setIsOpenConfirmPay] = useState(false);

  const [isOpenOrderDetail, setIsOpenOrderDetail] = useState(false);
  const [orderCode, setOrderCode] = useState<number | null>(null);

  const [orderInDayData, setOrderInDayData] = useState<DailySummary | null>(
    null,
  );

  const { data: monthlyDetail, isLoading } = useQuery({
    queryKey: ["monthlyDetail", id],
    queryFn: () => getMonthlySettlementDetailAPI(id),
    select: (res) => res.data,
    enabled: !!id,
  });

  const activeDay =
    orderInDayData ?? monthlyDetail?.dailySummaries?.[0] ?? null;

  const receiveMutation = useMutation({
    mutationFn: receiveMonthlySettlementAPI,
    onSuccess: () => {
      toast.success("Xác nhận đã nhận tiền thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["monthlySettlement", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["monthlySettlements"],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Xác nhận đã nhận tiền thất bại"));
    },
  });

  const handleReceive = (monthlySettlementId: string) => {
    const confirmPaid = window.confirm("Bạn có chắc đã nhận tiền không?");

    if (!confirmPaid) return;

    receiveMutation.mutate(monthlySettlementId);
  };

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <>
      <div className="space-y-6 mb-4">
        {/*Header */}
        <div className="flex items-center justify-between">
          {/*Left */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size={"sm"}
              onClick={() => router.back()}
              className="w-8 h-8"
            >
              <ArrowLeft />
            </Button>

            <h1 className="text-xl font-bold dark:text-foreground">
              Chi tiết thông tin đổi soát
            </h1>
          </div>
        </div>

        {/*thông tin tổng */}
        <section className="space-y-6">
          {/* HÀNG 1: THÔNG TIN CHUNG & TRẠNG THÁI */}
          <div className="flex flex-wrap items-center justify-between gap-6 bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200/60 shadow-sm">
            {/* Nhóm thông tin bên trái */}
            <div className="flex flex-wrap items-center gap-8">
              {/* Kỳ đối soát */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Kỳ đối soát
                </p>
                <p className="text-md font-bold text-slate-700 dark:text-slate-200 leading-none">
                  Tháng {monthlyDetail?.month} / {monthlyDetail?.year}
                </p>
              </div>

              <div className="h-12 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block" />

              {/* Ngày tạo */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Ngày tạo đối soát
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-none">
                  {monthlyDetail?.createdAt &&
                    new Date(monthlyDetail.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                </p>
              </div>

              <div className="h-12 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block" />

              {/* Trạng thái */}
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Trạng thái
                </p>
                <div>
                  <span
                    className={`px-3 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1 ring-inset ${formatMonthlySettlementStatusColor(monthlyDetail?.status || "")}`}
                  >
                    {formatMonthlySettlementStatusText(
                      monthlyDetail?.status || "",
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Nhóm Action bên phải */}
            <div className="flex items-center gap-3 min-w-[300px]">
              {monthlyDetail?.status === "PAID" && (
                <Button
                  variant="success"
                  disabled={receiveMutation.isPending}
                  onClick={() => handleReceive(monthlyDetail.id)}
                  className="flex-[1.5] h-11 font-bold rounded-xl"
                >
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                  Xác nhận đã nhận tiền
                </Button>
              )}
            </div>
          </div>

          {/* HÀNG 2: THỐNG KÊ HIỆU SUẤT TRONG THÁNG */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tổng đơn hàng */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Tổng sản phẩm bán
                </p>
                <p className="text-2xl font-black dark:text-slate-200">
                  {monthlyDetail?.totalItems}{" "}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-blue-500 shadow-sm">
                <Box size={20} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Tổng đơn bán hàng
                </p>
                <p className="text-2xl font-black dark:text-slate-200">
                  {monthlyDetail?.totalOrders}{" "}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-yellow-500 shadow-sm">
                <ShoppingCart size={20} />
              </div>
            </div>

            {/* Tổng doanh số */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Tổng doanh số
                </p>
                <p className="text-2xl font-black dark:text-slate-200">
                  {monthlyDetail?.totalSalesAmount?.toLocaleString("vi-VN")}{" "}
                  <span className="text-sm font-medium text-slate-900">₫</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-orange-500 shadow-sm">
                <BarChart3 size={20} />
              </div>
            </div>

            {/* Tổng hoa hồng (Trước khấu trừ) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Tổng hoa hồng
                </p>
                <p className="text-2xl font-black text-green-600">
                  {monthlyDetail?.totalCommissionAmount?.toLocaleString(
                    "vi-VN",
                  )}{" "}
                  <span className="text-xs font-medium text-green-600/60">
                    ₫
                  </span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-green-500 shadow-sm">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>

          {/* HÀNG 3: GRID THÔNG TIN ĐỐI TÁC & TÀI CHÍNH */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card: Đối tác */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                <Package size={24} />
              </div>
              <div className="overflow-hidden space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                  Đối tác
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {monthlyDetail?.partnerName}
                </p>
                <p className="text-[10px] text-blue-600 font-bold">
                  ID: {monthlyDetail?.partnerCode}
                </p>
              </div>
            </div>

            {/* Card: Thanh toán qua */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                <Banknote size={24} />
              </div>
              <div className="overflow-hidden space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                  Tài khoản nhận tiền
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-300 truncate">
                  {monthlyDetail?.bankAccountNumber}
                </p>
                <p className="text-[10px] text-blue-600 font-bold">
                  {monthlyDetail?.bankAccountName} • {monthlyDetail?.bankName}
                </p>
              </div>
            </div>

            {/* Card: Khấu trừ (Nếu có) */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                <ArrowDownToLine size={24} />
              </div>
              <div className="overflow-hidden space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Khấu trừ
                </p>
                <p className="text-sm font-bold text-red-600">
                  -{monthlyDetail?.deductionAmount?.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>

            {/* Card: Thực nhận (QUAN TRỌNG NHẤT) */}
            <div className="bg-blue-600 p-4 rounded-2xl border border-blue-700 shadow-lg flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform">
                <CircleDollarSign size={80} className="text-white" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
                <Wallet size={24} />
              </div>
              <div className="relative z-10 space-y-1">
                <p className="text-[10px] font-bold text-blue-100 uppercase">
                  Thực nhận cuối kỳ
                </p>
                <p className="text-lg font-black text-white">
                  {monthlyDetail?.finalAmount?.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>
          </div>

          {/* Ghi chú (Chỉ hiển thị nếu có note) */}
          {monthlyDetail?.note && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-3 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-900/40 p-3 px-4 rounded-2xl w-fit max-w-[80%] shadow-sm">
                <Info size={16} className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed italic">
                  <span className="font-bold not-italic uppercase tracking-wider mr-1">
                    Ghi chú:
                  </span>
                  {monthlyDetail.note}
                </p>
              </div>
            </div>
          )}
        </section>

        {/*tổng hợp theo từng ngày */}
        <main className="flex-1 overflow-hidden w-full grid grid-cols-5 gap-6 h-[calc(100vh-250px)]">
          {/* CỘT TRÁI (3/5): Tóm tắt theo ngày */}
          <div className="col-span-3 flex flex-col overflow-hidden">
            {/*Header */}
            <div className="flex-none mb-4 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" /> Chi tiết doanh
                thu từng ngày
              </h3>
            </div>

            {/*Content */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              {/* Khu vực cuộn danh sách */}
              <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
                {monthlyDetail?.dailySummaries?.map((day: DailySummary) => {
                  const isSelected = activeDay?.date === day.date;

                  return (
                    <div
                      key={day.date}
                      onClick={() => setOrderInDayData(day)}
                      className={`group flex cursor-pointer items-center gap-6 px-6 py-5 transition-all ${
                        isSelected
                          ? "bg-blue-50/50 dark:bg-blue-900/20 border-r-4 border-r-blue-500"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      {/* Cột 1: Ngày tháng */}
                      <div className="flex-none w-20">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          Ngày
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            isSelected
                              ? "text-blue-600"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {formatDateTime(day.date).date}
                        </span>
                      </div>

                      {/* Cột 2: Thông số (Đơn hàng & Doanh số) */}
                      <div className="flex-1 grid grid-cols-3 gap-4 border-l border-slate-100 dark:border-slate-800 pl-6">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">
                            Đơn hàng
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                            {day.totalOrders}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">
                            Sản phẩm
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                            {day.totalProductsSold}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">
                            Doanh số
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                            {day.totalSalesAmount.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                      </div>

                      {/* Cột 3: Hoa hồng & Icon điều hướng */}
                      <div className="text-right flex-none">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">
                          Hoa hồng
                        </span>
                        <p className="text-sm font-bold text-green-600">
                          +{day.totalCommissionAmount.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>

                      <ChevronRight
                        size={16}
                        className={`transition-transform shrink-0 ${
                          isSelected
                            ? "text-blue-500 translate-x-1"
                            : "text-slate-300"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (2/5): Danh sách đơn hàng của ngày đã chọn */}
          <div className="col-span-2 flex flex-col overflow-hidden">
            <div className="flex-none mb-4">
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Package size={16} className="text-indigo-500" />
                Đơn hàng{" "}
                {activeDay
                  ? `ngày ${new Date(activeDay.date).toLocaleDateString("vi-VN")}`
                  : ""}
              </h3>
            </div>
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              {/* Container cuộn */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeDay ? (
                  <div className="space-y-3">
                    {activeDay.transactions.map((trans: Order) => (
                      <div
                        key={trans.id}
                        onClick={() => {
                          setOrderCode(trans.orderCode);
                          setIsOpenOrderDetail(true);
                        }}
                        className="cursor-pointer group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
                      >
                        {/* Dòng đầu: Mã và Trạng thái */}
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              Mã đơn hàng
                            </p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                              #{trans.orderCode}
                            </p>
                          </div>
                          <span
                            className={`${formatOrderStatusColor(trans?.status)} inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase`}
                          >
                            {formatOrderStatusText(trans?.status)}
                          </span>
                        </div>

                        {/* Dòng giữa: Giá trị & Hoa hồng */}
                        <div className="grid grid-cols-2 gap-4 py-3">
                          <div>
                            <p className="text-[12px] text-slate-500 font-medium">
                              Giá trị đơn
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                              {trans.totalAmount.toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[12px] text-slate-500 font-medium">
                              Hoa hồng
                            </p>
                            <p className="text-sm font-black text-green-600">
                              +{trans.totalCommission.toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        </div>

                        {/* Dòng cuối: Thời gian */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Clock size={14} className="opacity-70" />
                          <span className="text-xs">
                            {new Date(trans.orderDate).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* State khi chưa có dữ liệu */
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 opacity-60">
                    <Receipt size={48} strokeWidth={1} className="mb-3" />
                    <p className="text-xs font-medium">
                      Chọn ngày để xem chi tiết đơn hàng
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* <OrderDetailModal
        orderCode={orderCode || 0}
        isOpen={isOpenOrderDetail}
        onClose={() => {
          setIsOpenOrderDetail(false);
          setOrderCode(null);
        }}
      /> */}

      {orderCode && (
        <ViewOrderDetailSheet
          orderCode={orderCode}
          open={isOpenOrderDetail}
          onOpenChange={setIsOpenOrderDetail}
        />
      )}
    </>
  );
}
