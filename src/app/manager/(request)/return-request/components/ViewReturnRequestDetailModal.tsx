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
  formatDamageReportStatusColor,
  formatDamageReportStatusText,
  formatShipmentStatusColor,
  formatShipmentStatusText,
  formatStoreOrderRefillRequestStatusColor,
  formatStoreOrderRefillRequestStatusText,
} from "@/src/utils/formatStatus";
import { useState } from "react";
import { DamageReportItem, Shipment } from "@/src/types";
import {
  AlertCircle,
  Building2,
  FileText,
  Layers,
  MapPin,
  Package,
  Store,
  Tag,
  Truck,
  User,
  UserCheck,
  Warehouse,
} from "lucide-react";
import ShipInfoItem from "@/src/components/ShipmentComponent/ShipInfoItem";
import Image from "next/image";
import { getDamageReportDetailAPI } from "@/src/services/damage-report.service";
import {
  formatColorNameToVN,
  formatDateTime,
  formatSourceDamageReport,
} from "@/src/utils/format";
import { ImageView } from "@/src/components/ImageView";
import { getShipmentDetailByDamageReportIdAPI } from "@/src/services/shipment.service";
import ShipTimeNode from "@/src/components/ShipmentComponent/ShipTimeNode";
import { ShipmentUrls } from "@/src/components/ShipmentComponent/ShipmentUrls";

type ViewReturnRequestModalDetailProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
};

function ViewReturnRequestModalDetail({
  requestId,
  isOpen,
  onClose,
}: ViewReturnRequestModalDetailProps) {
  const { data: damageRequestDetail, isLoading } = useQuery({
    queryKey: ["damageRequestDetail", requestId],
    queryFn: () => getDamageReportDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  const { data: shipmentDetail, isLoading: isLoadingShipmentDetail } = useQuery(
    {
      queryKey: ["shipmentDetail", requestId],
      queryFn: () => getShipmentDetailByDamageReportIdAPI(requestId!),
      select: (res) => res.data[0] as Shipment,
      enabled: !!requestId && isOpen,
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
                    Chi tiết đơn trả hàng{" "}
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Mã đơn:{" "}
                    <span className="font-mono font-bold text-primary">
                      {damageRequestDetail?.code}
                    </span>
                  </DialogDescription>
                </div>
                <div
                  className={`px-4 py-1.5 mr-4 rounded-full text-sm font-bold shadow-sm ${formatDamageReportStatusColor(damageRequestDetail?.status)}`}
                >
                  {formatDamageReportStatusText(damageRequestDetail?.status)}
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
            ) : !damageRequestDetail ? (
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
                      value={damageRequestDetail?.storeName}
                      icon={<Store className="h-3.5 w-3.5" />}
                    />
                    <ShipInfoItem
                      label="Người yêu cầu"
                      value={damageRequestDetail?.reportedByName}
                      icon={<User className="h-3.5 w-3.5" />}
                    />
                    <div className="col-span-2">
                      <ShipInfoItem
                        label="Địa chỉ nhận hàng"
                        value={damageRequestDetail?.storeAddress}
                        icon={<MapPin className="h-3.5 w-3.5" />}
                      />
                    </div>
                    <ShipInfoItem
                      label="Loại hàng"
                      value={
                        damageRequestDetail?.type === "Product"
                          ? "Sản phẩm"
                          : damageRequestDetail?.type === "Shelf"
                            ? "Kệ"
                            : "Hỗn hợp"
                      }
                      icon={<Layers className="h-3 w-3" />}
                    />
                    <div className="col-span-2">
                      <ShipInfoItem
                        label="Nguyên nhân hư hỏng"
                        value={
                          <div className="rounded-lg text-orange-700 font-bold">
                            {formatSourceDamageReport(
                              damageRequestDetail?.source || "",
                            )}
                          </div>
                        }
                        icon={<AlertCircle className="h-3.5 w-3.5" />}
                      />
                    </div>
                    {damageRequestDetail?.description && (
                      <div className="col-span-2">
                        <ShipInfoItem
                          label="Ghi chú từ cửa hàng"
                          value={damageRequestDetail?.description}
                          icon={<FileText className="h-3 w-3" />}
                          isNote
                        />
                      </div>
                    )}
                    <ShipInfoItem
                      label="Đại diện công ty chấp nhận"
                      value={damageRequestDetail?.partnerAdminName}
                      icon={<User className="h-3 w-3" />}
                    />
                    <ShipInfoItem
                      label="Thời gian duyệt"
                      value={
                        formatDateTime(
                          damageRequestDetail?.partnerAdminApprovedAt,
                        ).full || ""
                      }
                      icon={<User className="h-3.5 w-3.5" />}
                    />
                    {damageRequestDetail?.status === "Rejected" ? (
                      <>
                        <ShipInfoItem
                          label="Người từ chối"
                          value={damageRequestDetail?.reviewedByName}
                          icon={<User className="h-3 w-3" />}
                        />

                        <ShipInfoItem
                          label="Thời gian từ chối"
                          value={
                            formatDateTime(damageRequestDetail?.reviewedAt)
                              .full || ""
                          }
                          icon={<User className="h-3.5 w-3.5" />}
                        />
                      </>
                    ) : (
                      <>
                        <ShipInfoItem
                          label="Quản trị viên chấp nhận"
                          value={damageRequestDetail?.reviewedByName}
                          icon={<User className="h-3 w-3" />}
                        />
                        <ShipInfoItem
                          label="Thời gian duyệt"
                          value={
                            formatDateTime(damageRequestDetail?.reviewedAt)
                              .full || ""
                          }
                          icon={<User className="h-3.5 w-3.5" />}
                        />
                      </>
                    )}
                  </div>

                  {damageRequestDetail?.status === "Rejected" && (
                    <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                      <div className="shrink-0 mt-0.5 text-red-500">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-0.5">
                          Lý do từ chối
                        </p>
                        <p className="text-sm text-red-700">
                          {damageRequestDetail?.adminNote || "Không có ghi chú"}
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                {/* SECTION 2: DANH SÁCH SẢN PHẨM (Dạng bảng phẳng) */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wider">
                      <Package className="h-4 w-4" /> 2. Chi tiết hàng trả
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 divide-y bg-muted/20 p-4 rounded-xl border border-dashed gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {damageRequestDetail?.items.map((item: DamageReportItem) =>
                      item.type === "Product" ? (
                        <ProductDamageItem key={item.id} item={item} />
                      ) : (
                        <ShelfDamageItem key={item.id} item={item} />
                      ),
                    )}
                  </div>
                </section>

                {/* SECTION 3: THÔNG TIN VẬN CHUYỂN & ĐIỀU PHỐI */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wider">
                      <Truck className="h-4 w-4" /> 3. Trạng thái vận chuyển
                    </div>
                    {shipmentDetail?.status && (
                      <span
                        className={`text-[12px] font-medium ${formatShipmentStatusColor(shipmentDetail?.status)}`}
                      >
                        {formatShipmentStatusText(shipmentDetail?.status)}
                      </span>
                    )}
                  </div>

                  {isLoadingShipmentDetail ? (
                    <div className="p-12 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      Đang tải dữ liệu...
                    </div>
                  ) : shipmentDetail ? (
                    <div className="bg-green-50/30 p-4 rounded-xl border border-dashed border-green-100 space-y-4">
                      <div className="grid grid-cols-2 gap-8 pb-4 border-b border-dashed">
                        <div className="space-y-3">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            Vận hành
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[11px] text-slate-500">
                                Từ cửa hàng
                              </p>
                              <p className="text-sm font-bold text-slate-800">
                                {shipmentDetail.toLocationName}
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
                                Nhân viên giao hàng
                              </p>
                              <p className="text-sm font-bold text-slate-800">
                                {shipmentDetail.shipperName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <ShipTimeNode
                          label="Lấy hàng"
                          time={shipmentDetail.returnPickedUpAt}
                        />
                        <ShipTimeNode
                          label="Đến kho"
                          time={shipmentDetail.arrivedWarehouseAt}
                        />
                        <ShipTimeNode
                          label="Hoàn tất"
                          time={shipmentDetail.warehouseReceivedAt}
                        />
                      </div>

                      <ShipmentUrls
                        mediaUrls={shipmentDetail.medias || []}
                      />
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-400 italic text-sm bg-slate-100 rounded-xl">
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
              <Button variant="outline" onClick={onClose}>
                Đóng cửa sổ
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ProductDamageItem = ({ item }: { item: DamageReportItem }) => {
  return (
    <div
      key={item.id}
      className="flex items-center justify-between hover:bg-white transition-colors"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="h-14 w-14 rounded-lg border bg-slate-50 flex-shrink-0 overflow-hidden relative shadow-sm">
          {item?.product?.imageUrl ? (
            <Image
              src={item?.product?.imageUrl}
              alt={item?.product?.productName || ""}
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

        <div className="min-w-0">
          <h5 className="font-bold text-[14px] text-slate-900 leading-tight truncate">
            {item?.product?.productName || "N/A"}
          </h5>

          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center text-[12px] text-slate-500 whitespace-nowrap">
              {item?.product?.sku}
            </div>

            <span className="w-1 h-1 rounded-full bg-slate-300"></span>

            <div className="flex items-center gap-1 text-[12px]">
              <span className="font-semibold text-slate-700">
                {formatColorNameToVN(item?.product?.colorName)}
              </span>
            </div>
          </div>
          <ImageView
            mediaUrls={item?.mediaUrls}
            productName={item?.product?.productName}
          />
        </div>
      </div>

      <div className="flex flex-col items-end ml-auto shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-0.5">
          Số lượng
        </span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-black text-slate-900 leading-none">
            {item.quantity}
          </span>
        </div>
      </div>
    </div>
  );
};

const ShelfDamageItem = ({ item }: { item: DamageReportItem }) => {
  return (
    <div
      key={item.id}
      className="flex items-center justify-between hover:bg-white transition-colors"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="h-14 w-14 rounded-lg border bg-slate-50 flex-shrink-0 overflow-hidden relative shadow-sm">
          {item?.shelf?.imageUrl ? (
            <Image
              src={item?.shelf.imageUrl}
              alt={item?.shelf.shelfCode || ""}
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

        <div className="min-w-0">
          <h5 className="font-bold text-[14px] text-slate-900 leading-tight truncate">
            {item?.shelf.shelfName || "N/A"}
          </h5>

          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center text-[12px] text-slate-500 whitespace-nowrap">
              {item?.shelf.shelfCode}
            </div>
          </div>
          <ImageView
            mediaUrls={item.mediaUrls}
            productName={item?.shelf.shelfName}
          />
        </div>
      </div>

      <div className="flex flex-col items-end ml-auto shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-0.5">
          Số lượng
        </span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-black text-slate-900 leading-none">
            {item.quantity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewReturnRequestModalDetail;
