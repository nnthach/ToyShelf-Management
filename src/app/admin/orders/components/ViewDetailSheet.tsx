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
import { getOrderDetailPartnerAPI } from "@/src/services/order.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";
import { RefillRequestProductColor } from "@/src/types";
import { useState } from "react";

function ViewDetailSheet({ orderCode }: { orderCode: number }) {
  const [open, setOpen] = useState(false);

  const { data: orderDetailPartner } = useQuery({
    queryKey: ["orderPartner", orderCode],
    queryFn: () => getOrderDetailPartnerAPI(orderCode),
    select: (res) => res.data,
    enabled: !!orderCode && open,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
              Đơn hàng #{orderDetailPartner?.orderCode || 0}
            </SheetTitle>
            <span
              className={`px-3 py-1 rounded-full text-sm mr-4 font-bold shadow-sm ${formatOrderStatusColor(orderDetailPartner?.status || "")}`}
            >
              {formatOrderStatusText(orderDetailPartner?.status || "")}
            </span>
          </div>
        </SheetHeader>
        {!orderDetailPartner ? (
          <div className="p-6">Loading...</div>
        ) : (
          <>
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
                      {orderDetailPartner.customerName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-semibold text-md flex items-center gap-1">
                      {orderDetailPartner.customerEmail}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Đối tác</p>
                    <p className="font-semibold text-md flex items-center gap-1">
                      {orderDetailPartner.partnerName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Cửa hàng</p>
                    <p className="font-semibold text-md flex items-center gap-1">
                      {orderDetailPartner.storeName}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-slate-500">
                      Nhân viên thực hiện
                    </p>
                    <p className="font-semibold text-md flex items-center gap-1">
                      {orderDetailPartner?.staffName || "N/A"} -{" "}
                      {orderDetailPartner?.staffEmail || "N/A"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Section: Chi tiết sản phẩm */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <ShoppingBag size={14} /> Danh sách sản phẩm (
                  {orderDetailPartner.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {orderDetailPartner.items?.map(
                    (item: RefillRequestProductColor, index: number) => (
                      <div
                        key={index}
                        className="flex gap-4 p-3 border rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        {/* Ảnh sản phẩm */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border shrink-0 bg-gray-50 flex items-center justify-center">
                          {item?.imageUrl ? (
                            <Image
                              src={
                                item.imageUrl ||
                                "/images/placeholder-product.png"
                              }
                              alt={item.productName || "Product"}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package size={24} className="text-slate-300" />
                          )}
                        </div>

                        {/* Nội dung thông tin */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          {/* Phần trên: Tên sản phẩm & SKU */}
                          <div>
                            <h4 className="font-bold text-slate-800 truncate">
                              {item.productName}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                              {item.sku}
                            </p>
                          </div>

                          {/* Phần dưới: Giá và Hoa hồng */}
                          <div className="flex justify-between items-end mt-1">
                            {/* Bên trái: Đơn giá và % Hoa hồng */}
                            <div className="space-y-0.5">
                              <div className="text-sm text-slate-600">
                                <span>{item.price?.toLocaleString()}đ</span>
                                <span className="mx-1 text-slate-500">×</span>
                                <span className="font-medium text-slate-700">
                                  {item.quantity}
                                </span>
                              </div>
                              {item?.commissionRate != null && (
                                <p className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                                  Hoa hồng{" "}
                                  {((item.commissionRate ?? 0) * 100).toFixed(
                                    0,
                                  )}
                                  %
                                </p>
                              )}
                            </div>

                            {/* Bên phải: Thành tiền và Số tiền hoa hồng */}
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-900">
                                {item.subTotal?.toLocaleString()}đ
                              </p>

                              {/* Chỉ hiện tiền hoa hồng nếu có số > 0 */}
                              <p className="text-[14px] text-emerald-600 font-semibold">
                                {Number(
                                  item?.commissionAmount || 0,
                                ).toLocaleString()}
                                đ
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>

              {/* Section: Thanh toán & Thời gian */}
              <section className="grid grid-cols-2 gap-4 border-t pt-6">
                {/* Cột 1: Thông tin thanh toán gộp */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Thanh toán
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {orderDetailPartner.paymentMethod}
                    </p>
                    {orderDetailPartner.bankReference && (
                      <p className="text-[12px] text-slate-600 mt-0.5 font-medium break-all">
                        Mã: {orderDetailPartner.bankReference}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cột 2: Thời gian */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Ngày tạo
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(orderDetailPartner.createdAt).toLocaleString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer: Tổng tiền */}
            <div className="p-6 border-t bg-slate-50 space-y-4">
              {/* Dòng 1: Tổng giá trị đơn hàng */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-slate-300 rounded-full"></div>
                  <span className="text-slate-600 font-semibold text-sm">
                    Tổng thanh toán
                  </span>
                </div>
                <span className="text-xl font-bold text-slate-900">
                  {orderDetailPartner.totalAmount?.toLocaleString()}đ
                </span>
              </div>

              {/* Dòng 2: Tổng hoa hồng */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-emerald-400 rounded-full"></div>
                  <span className="text-slate-600 font-semibold text-sm">
                    Tổng hoa hồng nhận được
                  </span>
                </div>
                <span className="text-xl font-bold text-emerald-600">
                  {orderDetailPartner.totalCommission?.toLocaleString()}đ
                </span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
