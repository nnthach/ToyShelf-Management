"use client";

import {
  Eye,
  Package,
  User,
  Calendar,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";
import { getOrderDetailAPI } from "@/src/services/order.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";
import { RefillRequestProductColor } from "@/src/types";

function ViewDetailSheet({ orderCode }: { orderCode: number }) {
  const { data: orderDetail, isLoading } = useQuery({
    queryKey: ["order", orderCode],
    queryFn: () => getOrderDetailAPI(orderCode),
    select: (res) => res.data,
    enabled: !!orderCode,
  });

  if (!orderDetail) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          title="Detail"
          className="p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-500"
        >
          <Eye size={20} />
        </button>
      </SheetTrigger>

      <SheetContent className="w-full !max-w-[550px] flex flex-col h-full p-0">
        <SheetHeader className="p-6 border-b bg-slate-50/50">
          <div className="flex justify-between items-center">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Package className="text-blue-600" size={24} />
              Đơn hàng #{orderDetail.orderCode}
            </SheetTitle>
            <span
              className={`px-3 py-1 rounded-full text-sm mr-4 font-bold shadow-sm ${formatOrderStatusColor(orderDetail.status)}`}
            >
              {formatOrderStatusText(orderDetail.status)}
            </span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section: Thông tin khách hàng */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <User size={14} /> Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Tên khách hàng</p>
                <p className="font-semibold text-md">
                  {orderDetail.customerName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Số điện thoại</p>
                <p className="font-semibold text-md flex items-center gap-1">
                  {orderDetail.customerPhone}
                </p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-sm text-slate-500">Cửa hàng</p>
                <p className="font-semibold text-md flex items-center gap-1">
                  {orderDetail.storeName}
                </p>
              </div>
            </div>
          </section>

          {/* Section: Chi tiết sản phẩm */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <ShoppingBag size={14} /> Danh sách sản phẩm (
              {orderDetail.items?.length || 0})
            </h3>
            <div className="space-y-3">
              {orderDetail.items?.map(
                (item: RefillRequestProductColor, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 p-2 border rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="relative w-18 h-18 rounded-lg overflow-hidden border shrink-0 bg-gray-50 flex items-center justify-center">
                      {item?.imageUrl ? (
                        <Image
                          src={
                            item.imageUrl || "/images/placeholder-product.png"
                          }
                          alt={item.productName || "N/A"}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <Package size={20} className="text-slate-300" /> // Hiển thị icon nếu không có ảnh
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-bold text-md truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono uppercase">
                        {item.sku}
                      </p>
                      <div className="flex justify-between items-end mt-1">
                        <p className="text-sm">
                          {(item?.price ?? 0).toLocaleString()}đ x{" "}
                          <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <p className="font-bold text-md text-blue-600">
                          {(item.subTotal ?? 0).toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Section: Thanh toán & Thời gian */}
          <section className="grid grid-cols-2 gap-4 border-t pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Thanh toán
                </p>
                <p className="text-sm font-semibold">
                  {orderDetail.paymentMethod}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Ngày tạo
                </p>
                <p className="text-sm font-semibold">
                  {new Date(orderDetail.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer: Tổng tiền */}
        <div className="p-6 border-t bg-slate-50">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Tổng thanh toán</span>
            <span className="text-2xl font-black text-green-600">
              {orderDetail.totalAmount?.toLocaleString()}đ
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
