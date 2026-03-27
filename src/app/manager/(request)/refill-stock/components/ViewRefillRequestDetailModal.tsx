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
import { useQuery } from "@tanstack/react-query";
import {
  formatShipmentStatusColor,
  formatShipmentStatusText,
  formatStoreOrderRefillRequestStatusColor,
  formatStoreOrderRefillRequestStatusText,
} from "@/src/utils/formatStatus";
import { useState } from "react";
import { getRefillDetailAPI } from "@/src/services/refill.service";
import { getShipmentDetailByIdAPI } from "@/src/services/shipment.service";
import ConfirmReceiveModal from "./ConfirmReceiveModal";
import { RefillRequestProductColor, Shipment } from "@/src/types";
import {
  MapPin,
  Package,
  Store,
  Truck,
  User,
  UserCheck,
  Warehouse,
} from "lucide-react";
import ShipInfoItem from "@/src/components/ShipmentComponent/ShipInfoItem";
import ShipTimeNode from "@/src/components/ShipmentComponent/ShipTimeNode";
import { formatColorNameToVN } from "@/src/utils/format";
import Image from "next/image";

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
  const [isOpenConfirmReceive, setIsOpenConfirmReceive] = useState(false);

  const { data: storeOrderDetail, isLoading } = useQuery({
    queryKey: ["storeOrderDetail", requestId],
    queryFn: () => getRefillDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  // const assignmentId = storeOrderDetail?.shipmentAssignmentIds?.[0];
  // const { data: shipmentAssignDetail } = useQuery({
  //   queryKey: ["shipmentAssignDetail", assignmentId],
  //   queryFn: () => getShipmentAssignDetailByIdAPI(assignmentId!),
  //   select: (res) => res.data,
  //   enabled: !!assignmentId,
  // });

  const shipmentId = storeOrderDetail?.shipmentIds?.[0];
  const { data: shipmentDetail } = useQuery({
    queryKey: ["shipmentDetail", shipmentId],
    queryFn: () => getShipmentDetailByIdAPI(shipmentId!),
    select: (res) => res.data as Shipment,
    enabled: !!shipmentId,
  });

  const shipmentItemMap = new Map(
    shipmentDetail?.items?.map((item: RefillRequestProductColor) => [
      item.productColorId,
      item,
    ]) || [],
  );

  const itemsWithQuantities = storeOrderDetail?.items?.map(
    (item: RefillRequestProductColor) => {
      // Tra cứu thông tin shipment tương ứng
      const shipmentItem = shipmentItemMap.get(item.productColorId);

      return {
        ...item,
        expectedQuantity: shipmentItem?.expectedQuantity || 0,
        receivedQuantity: shipmentItem?.receivedQuantity || 0,
      };
    },
  );

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
            <div className="max-w-5xl mx-auto p-6 space-y-8">
              {/* SECTION 1: THÔNG TIN CỬA HÀNG */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-sm tracking-wider">
                  <Store className="h-4 w-4" /> 1. Thông tin yêu cầu từ cửa hàng
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
                    TỔNG LOẠI SẢN PHẨM: {itemsWithQuantities?.length || 0}
                  </span>
                </div>

                <div className="flex flex-col divide-y bg-muted/20 p-4 rounded-xl border border-dashed gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {itemsWithQuantities?.map(
                    (item: RefillRequestProductColor, index: number) => {
                      const expected = item.quantity || 0;
                      const received = item.receivedQuantity || 0;
                      const isShortfall = received < expected;

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
                                    {formatColorNameToVN(item?.color as string)}
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
                                {expected}
                              </span>
                            </div>

                            {/* Thực nhận */}
                            <div className="flex flex-col items-center min-w-[50px]">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">
                                Thực nhận
                              </span>
                              <span className="text-base font-bold text-slate-900">
                                {received}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>

                {(!itemsWithQuantities || itemsWithQuantities.length === 0) && (
                  <div className="py-20 text-center text-slate-300">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm italic">Không có dữ liệu sản phẩm</p>
                  </div>
                )}
              </section>

              {/* SECTION 3: THÔNG TIN VẬN CHUYỂN & ĐIỀU PHỐI */}
              <section>
                {/* Header có Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wider">
                    <Truck className="h-4 w-4" /> 3. Trạng thái vận chuyển
                  </div>
                  {/* Status Badge - Bạn có thể map màu theo status ở đây */}
                  {shipmentDetail?.status && (
                    <span
                      className={`text-[12px] font-medium ${formatShipmentStatusColor(shipmentDetail?.status)}`}
                    >
                      {formatShipmentStatusText(shipmentDetail?.status)}
                    </span>
                  )}
                </div>

                {shipmentDetail ? (
                  <div className="bg-green-50/30 p-4 rounded-xl border border-dashed border-green-100 space-y-4">
                    {/* Thông tin thực thi: Kho & Shipper */}
                    <div className="grid grid-cols-2 gap-8 pb-4 border-b border-dashed">
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          Vận hành
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                            <Warehouse className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500">Từ kho</p>
                            <p className="text-sm font-bold text-slate-800">
                              {shipmentDetail.fromLocationName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          Nhân sự
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-orange-50 flex items-center justify-center text-orange-600">
                            <UserCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500">
                              Shipper
                            </p>
                            <p className="text-sm font-bold text-slate-800">
                              {shipmentDetail.shipperName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline đơn giản: Trái nhãn - Phải thời gian */}
                    <div className="grid grid-cols-3 gap-2">
                      <ShipTimeNode
                        label="Lấy hàng"
                        time={shipmentDetail.pickedUpAt}
                      />
                      <ShipTimeNode
                        label="Giao hàng"
                        time={shipmentDetail.deliveredAt}
                      />
                      <ShipTimeNode
                        label="Hoàn tất"
                        time={shipmentDetail.receivedAt}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 italic text-sm bg-slate-100 rounded-xl">
                    Chưa có thông tin vận chuyển
                  </div>
                )}
              </section>
            </div>
          </div>

          {/*footer*/}
          <div className="p-4 border-t bg-white">
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose}>
                Đóng cửa sổ
              </Button>

              {shipmentDetail && shipmentDetail?.status === "Delivered" && (
                <Button
                  variant="success"
                  onClick={() => setIsOpenConfirmReceive(true)}
                >
                  Xác nhận đã nhận hàng
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmReceiveModal
        shipmentId={shipmentId}
        requestId={requestId}
        items={shipmentDetail?.items || []}
        isOpen={isOpenConfirmReceive}
        onClose={() => setIsOpenConfirmReceive(false)}
        onSuccess={onClose}
      />
    </>
  );
}

export default ViewRefillRequestModalDetail;
