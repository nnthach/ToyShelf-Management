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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  formatShipmentStatusColor,
  formatShipmentStatusText,
  formatStoreOrderRefillRequestStatusColor,
  formatStoreOrderRefillRequestStatusText,
} from "@/src/utils/formatStatus";
import {
  approveRefillRequestByPartnerAPI,
  getRefillDetailAPI,
  rejectRefillRequestAPI,
} from "@/src/services/refill.service";
import { getShipmentDetailByStoreOrderIdAPI } from "@/src/services/shipment.service";
import { RefillRequestProductColor, Shipment } from "@/src/types";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Package,
  Store,
  Truck,
  User,
  UserCheck,
  UserX,
  Warehouse,
  XCircle,
} from "lucide-react";
import ShipInfoItem from "@/src/components/ShipmentComponent/ShipInfoItem";
import ShipTimeNode from "@/src/components/ShipmentComponent/ShipTimeNode";
import { formatColorNameToVN, formatDateTime } from "@/src/utils/format";
import Image from "next/image";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { useState } from "react";

type ViewRefillRequestModalDetailProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
};

function ViewRefillRequestModalDetail({
  requestId,
  isOpen,
  onClose,
}: ViewRefillRequestModalDetailProps) {
  const queryClient = useQueryClient();

  const [isApproving, setIsApproving] = useState(false);

  const { data: storeOrderDetail, isLoading } = useQuery({
    queryKey: ["storeOrderDetail", requestId],
    queryFn: () => getRefillDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  const { data: shipmentDetailList, isLoading: isLoadingShipmentDetail } =
    useQuery({
      queryKey: ["shipmentDetailList", requestId],
      queryFn: () => getShipmentDetailByStoreOrderIdAPI(requestId!),
      select: (res) => res.data as Shipment[],
      enabled: !!requestId && isOpen,
    });

  async function handleApprove() {
    setIsApproving(true);
    try {
      await approveRefillRequestByPartnerAPI(requestId);

      queryClient.invalidateQueries({
        queryKey: ["refillRequests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["storeOrderDetail", requestId],
      });

      toast.success("Chấp nhận yêu cầu thành công");
    } catch (error) {
      toast.error(getErrorMessage(error, "Chấp nhận yêu cầu thất bại"));
    } finally {
      setIsApproving(false);
    }
  }

  async function handleReject() {
    setIsApproving(true);

    try {
      await rejectRefillRequestAPI(requestId);

      queryClient.invalidateQueries({
        queryKey: ["refillRequests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["storeOrderDetail", requestId],
      });

      toast.success("Từ chối yêu cầu thành công");

      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Từ chối yêu cầu thất bại"));
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          if (!value) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0 overflow-hidden">
          <div className="p-6 border-b bg-slate-50/50">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-xl">
                    Chi tiết yêu cầu đặt hàng
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Mã hệ thống:{" "}
                    <span className="font-mono font-bold text-primary">
                      {storeOrderDetail?.code}
                    </span>
                  </DialogDescription>
                </div>
                <div
                  className={`px-4 py-1.5 mr-4 rounded-full text-sm font-bold shadow-sm ${formatStoreOrderRefillRequestStatusColor(storeOrderDetail?.status)}`}
                >
                  {formatStoreOrderRefillRequestStatusText(
                    storeOrderDetail?.status,
                  )}
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                  <p className="text-sm">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : !storeOrderDetail ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <Package className="h-10 w-10 opacity-20" />
                <p className="text-sm italic">Không có dữ liệu</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto p-6 space-y-8">
                {/* SECTION 1: THÔNG TIN CỬA HÀNG */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-sm tracking-wider">
                    <Store className="h-4 w-4" /> 1. Thông tin yêu cầu từ cửa
                    hàng
                  </div>

                  <div className="grid grid-cols-2 gap-6 bg-muted/20 p-4 rounded-xl border border-dashed">
                    <ShipInfoItem
                      label="Cửa hàng"
                      value={storeOrderDetail?.storeName}
                      icon={<Store className="h-3.5 w-3.5" />}
                    />
                    <ShipInfoItem
                      label="Người yêu cầu"
                      value={storeOrderDetail?.requestName}
                      icon={<User className="h-3.5 w-3.5" />}
                    />
                    <div className="col-span-2">
                      <ShipInfoItem
                        label="Địa chỉ nhận hàng"
                        value={storeOrderDetail?.storeAddress}
                        icon={<MapPin className="h-3.5 w-3.5" />}
                      />
                    </div>
                    <ShipInfoItem
                      label="Chủ sở hữu duyệt đơn"
                      value={storeOrderDetail?.partnerAdminName}
                      icon={<User className="h-3.5 w-3.5" />}
                    />
                    <ShipInfoItem
                      label="Thời gian duyệt"
                      value={
                        formatDateTime(storeOrderDetail?.partnerAdminApprovedAt)
                          .full || ""
                      }
                      icon={<User className="h-3.5 w-3.5" />}
                    />

                    {storeOrderDetail?.status === "Rejected" ? (
                      <>
                        <ShipInfoItem
                          label="Người từ chối"
                          value={storeOrderDetail?.rejectName}
                          icon={<UserX className="h-3.5 w-3.5" />}
                        />
                        <ShipInfoItem
                          label="Thời gian từ chối"
                          value={
                            formatDateTime(storeOrderDetail?.rejectedAt).full ||
                            ""
                          }
                          icon={<User className="h-3.5 w-3.5" />}
                        />
                      </>
                    ) : (
                      <>
                        <ShipInfoItem
                          label="Quản trị viên duyệt đơn"
                          value={storeOrderDetail?.approveName}
                          icon={<User className="h-3.5 w-3.5" />}
                        />
                        <ShipInfoItem
                          label="Thời gian duyệt"
                          value={
                            formatDateTime(storeOrderDetail?.approvedAt).full ||
                            ""
                          }
                          icon={<User className="h-3.5 w-3.5" />}
                        />
                      </>
                    )}
                  </div>
                </section>

                {/* SECTION 2: DANH SÁCH SẢN PHẨM (Dạng bảng phẳng) */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wider">
                      <Package className="h-4 w-4" /> 2. Chi tiết sản phẩm & Đối
                      soát
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold border">
                      TỔNG LOẠI SẢN PHẨM: {storeOrderDetail?.items?.length || 0}
                    </span>
                  </div>

                  <div className="flex flex-col divide-y bg-muted/20 p-4 rounded-xl border border-dashed gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {storeOrderDetail?.items?.map(
                      (item: RefillRequestProductColor, index: number) => {
                        return (
                          <div
                            key={item.productColorId || index}
                            className="flex items-center justify-between pb-4 hover:bg-white transition-colors"
                          >
                            {/* BÊN TRÁI: IMAGE + THÔNG TIN SẢN PHẨM */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              {/* Image */}
                              <div className="h-14 w-14 rounded-lg border bg-slate-50 flex-shrink-0 overflow-hidden relative shadow-sm">
                                {item?.imageUrl ? (
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.productName || ""}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full w-full">
                                    <Package className="h-6 w-6 text-slate-200" />
                                  </div>
                                )}
                              </div>

                              {/* Text Info */}
                              <div className="min-w-0">
                                <h5 className="font-bold text-[13px] text-slate-800 uppercase leading-tight truncate mb-1">
                                  {item.productName}
                                </h5>
                                <div className="flex flex-wrap items-center gap-y-1 gap-x-3">
                                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                                    SKU: {item.sku || "N/A"}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    Màu:{" "}
                                    <span className="text-slate-600">
                                      {formatColorNameToVN(
                                        item?.color as string,
                                      )}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* BÊN PHẢI: THÔNG TIN YÊU CẦU & THỰC NHẬN */}
                            <div className="flex items-center gap-10 ml-6 shrink-0">
                              {/* Yêu cầu */}
                              <div className="flex flex-col items-center min-w-[50px]">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">
                                  Yêu cầu
                                </span>
                                <span className="text-base font-medium text-slate-900">
                                  {item.quantity}
                                </span>
                              </div>

                              {/* Thực nhận */}
                              <div className="flex flex-col items-center min-w-[50px]">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">
                                  Thực nhận
                                </span>
                                <span className="text-base font-bold text-slate-900">
                                  {item.fulfilledQuantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>

                  {(!storeOrderDetail?.items ||
                    storeOrderDetail?.items?.length === 0) && (
                    <div className="py-20 text-center text-slate-300">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm italic">
                        Không có dữ liệu sản phẩm
                      </p>
                    </div>
                  )}
                </section>

                {/* SECTION 3: THÔNG TIN VẬN CHUYỂN & ĐIỀU PHỐI */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wider">
                    <Truck className="h-4 w-4" /> 3. Trạng thái vận chuyển
                  </div>

                  {isLoadingShipmentDetail ? (
                    <div className="p-12 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      Đang tải dữ liệu...
                    </div>
                  ) : shipmentDetailList && shipmentDetailList.length > 0 ? (
                    <div className="space-y-6">
                      {shipmentDetailList.map((shipment, index) => {
                        const isReceived = shipment.storeReceivedAt;

                        return (
                          <div
                            key={shipment.id || index}
                            className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm flex flex-col"
                          >
                            {/* Header */}
                            <div className="bg-emerald-50/50 px-4 py-2 border-b border-emerald-100 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                                  Phiếu giao hàng #{index + 1}
                                </span>
                                <span className="text-[11px] font-mono font-bold text-emerald-700">
                                  {shipment.code}
                                </span>
                              </div>
                              {shipment.status && (
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border bg-white ${formatShipmentStatusColor(shipment.status)}`}
                                >
                                  {formatShipmentStatusText(shipment.status)}
                                </span>
                              )}
                            </div>

                            <div className="p-4 space-y-4">
                              {/* Info: Warehouse & Shipper */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <Warehouse className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                                      Gửi từ
                                    </p>
                                    <p className="text-[13px] font-bold text-slate-800 truncate">
                                      {shipment.fromLocationName}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 border-l pl-4 border-slate-100">
                                  <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                    <UserCheck className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                                      Shipper
                                    </p>
                                    <p className="text-[13px] font-bold text-slate-800 truncate">
                                      {shipment.shipperName || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Timeline */}
                              <div className="grid grid-cols-3 gap-2 py-3 border-y border-dashed border-slate-100">
                                <ShipTimeNode
                                  label="Lấy hàng"
                                  time={shipment.pickedUpAt}
                                />
                                <ShipTimeNode
                                  label="Giao hàng"
                                  time={shipment.deliveredAt}
                                />
                                <ShipTimeNode
                                  label="Hoàn tất"
                                  time={shipment.storeReceivedAt}
                                />
                              </div>

                              {/* Danh sách sản phẩm trong shipment */}
                              <div className="space-y-2">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                  <Package className="h-3 w-3" /> Chi tiết hàng
                                  hóa
                                </p>
                                <div className="bg-slate-50/50 rounded-lg border border-slate-100 divide-y divide-slate-100">
                                  {shipment.productItems?.map(
                                    (product, pIdx) => (
                                      <div
                                        key={pIdx}
                                        className="p-2 flex items-center justify-between gap-4"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                          <div className="h-8 w-8 rounded border bg-white shrink-0 overflow-hidden relative">
                                            <Image
                                              src={product.imageUrl || ""}
                                              alt=""
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-bold text-slate-800 truncate mb-0.5">
                                              {product.productName}
                                            </p>

                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 font-mono rounded border border-slate-200/50">
                                                {product.sku}
                                              </span>
                                              <span className="text-slate-300 text-[10px]">
                                                |
                                              </span>
                                              <p className="text-[11px] text-slate-500 font-medium">
                                                {formatColorNameToVN(
                                                  product?.color || "",
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Đối soát số lượng */}
                                        <div className="flex items-center gap-3 shrink-0">
                                          <div className="text-center min-w-[30px]">
                                            <p className="text-[8px] text-slate-400 uppercase font-bold">
                                              Giao
                                            </p>
                                            <p className="text-xs font-bold text-slate-600">
                                              {product.expectedQuantity}
                                            </p>
                                          </div>
                                          <div className="h-4 w-px bg-slate-200" />
                                          <div className="text-center min-w-[30px]">
                                            <p className="text-[8px] text-emerald-600 uppercase font-bold">
                                              Nhận
                                            </p>
                                            <p className="text-xs font-black text-emerald-600">
                                              {product.receivedQuantity}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Nút xác nhận nhận hàng */}
                            <div className="p-3 bg-slate-50 border-t border-emerald-100 flex justify-end">
                              {isReceived && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                  Đã nhận hàng
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-400 italic text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      Chưa có thông tin vận chuyển
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>

          {/*footer*/}
          <div className="p-4 border-t bg-white">
            <DialogFooter className="gap-2">
              {storeOrderDetail?.status === "Pending" && (
                <>
                  <Button
                    variant="error"
                    onClick={handleReject}
                    disabled={isApproving}
                    className="px-8 border-2"
                  >
                    {isApproving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Từ chối
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="px-8 border-2"
                  >
                    {isApproving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Chấp nhận
                  </Button>
                </>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ViewRefillRequestModalDetail;
