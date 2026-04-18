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
  getShipmentDetailByIdAPI,
  getShipmentDetailByShelfOrderIdAPI,
} from "@/src/services/shipment.service";
import { RefillShelfRequestItem, Shipment } from "@/src/types";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Layers,
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
import Image from "next/image";
import {
  approveRefillShelfRequestByPartnerAPI,
  getRefillShelfDetailAPI,
} from "@/src/services/refill-shelf.service";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { toast } from "react-toastify";
import { formatDateTime } from "@/src/utils/format";

type ViewRefillShelfRequestModalDetailProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
};

function ViewRefillShelfRequestModalDetail({
  requestId,
  isOpen,
  onClose,
}: ViewRefillShelfRequestModalDetailProps) {
  const queryClient = useQueryClient();

  const { data: storeOrderShelfDetail, isLoading } = useQuery({
    queryKey: ["storeOrderShelfDetail", requestId],
    queryFn: () => getRefillShelfDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  const { data: shipmentDetailList } = useQuery({
    queryKey: ["shipmentDetailList", requestId],
    queryFn: () => getShipmentDetailByShelfOrderIdAPI(requestId!),
    select: (res) => res.data as Shipment[],
    enabled: !!requestId && isOpen,
  });

  async function handleApprove() {
    try {
      await approveRefillShelfRequestByPartnerAPI(requestId);

      queryClient.invalidateQueries({
        queryKey: ["refillShelfRequests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["storeOrderShelfDetail", requestId],
      });

      toast.success("Chấp nhận yêu cầu thành công");
    } catch (error) {
      toast.error(getErrorMessage(error, "Chấp nhận yêu cầu thất bại"));
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
                    Chi tiết đơn đặt kệ
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Mã đơn:{" "}
                    <span className="font-mono font-bold text-primary">
                      {storeOrderShelfDetail?.code}
                    </span>
                  </DialogDescription>
                </div>
                <div
                  className={`px-4 py-1.5 mr-4 rounded-full text-sm font-bold shadow-sm ${formatStoreOrderRefillRequestStatusColor(storeOrderShelfDetail?.status)}`}
                >
                  {formatStoreOrderRefillRequestStatusText(
                    storeOrderShelfDetail?.status,
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
            ) : !storeOrderShelfDetail ? (
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
                      value={storeOrderShelfDetail?.storeName}
                      icon={<Store className="h-3.5 w-3.5" />}
                    />
                    <ShipInfoItem
                      label="Người yêu cầu"
                      value={storeOrderShelfDetail?.requestName}
                      icon={<User className="h-3.5 w-3.5" />}
                    />
                    <div className="col-span-2">
                      <ShipInfoItem
                        label="Địa chỉ nhận hàng"
                        value={storeOrderShelfDetail?.storeAddress}
                        icon={<MapPin className="h-3.5 w-3.5" />}
                      />
                    </div>
                    <ShipInfoItem
                      label="Chủ sở hữu duyệt đơn"
                      value={storeOrderShelfDetail?.partnerAdminName}
                      icon={<User className="h-3.5 w-3.5" />}
                    />
                    <ShipInfoItem
                      label="Thời gian duyệt"
                      value={
                        formatDateTime(
                          storeOrderShelfDetail?.partnerAdminApprovedAt,
                        ).full || ""
                      }
                      icon={<User className="h-3.5 w-3.5" />}
                    />

                    {storeOrderShelfDetail?.status === "Rejected" ? (
                      <ShipInfoItem
                        label="Quản trị viên từ chối"
                        value={storeOrderShelfDetail?.rejectName}
                        icon={<User className="h-3 w-3" />}
                      />
                    ) : (
                      <ShipInfoItem
                        label="Quản trị viên chấp nhận"
                        value={storeOrderShelfDetail?.approveName}
                        icon={<User className="h-3 w-3" />}
                      />
                    )}
                    {storeOrderShelfDetail?.note && (
                      <ShipInfoItem
                        label="Ghi chú từ cửa hàng"
                        value={storeOrderShelfDetail?.note}
                        icon={<FileText className="h-3 w-3" />}
                        isNote
                      />
                    )}
                  </div>

                  {storeOrderShelfDetail?.status === "Rejected" && (
                    <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                      <div className="shrink-0 mt-0.5 text-red-500">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-0.5">
                          Lý do từ chối
                        </p>
                        <p className="text-sm text-red-700">
                          {storeOrderShelfDetail?.adminNote ||
                            "Không có ghi chú"}
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                {/* SECTION 2: DANH SÁCH SẢN PHẨM (Dạng bảng phẳng) */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wider">
                      <Package className="h-4 w-4" /> 2. Chi tiết kệ & Đối soát
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold border">
                      TỔNG LOẠI KỆ: {storeOrderShelfDetail?.items?.length || 0}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 divide-y bg-muted/20 p-4 rounded-xl border border-dashed gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {storeOrderShelfDetail?.items?.map(
                      (item: RefillShelfRequestItem, index: number) => {
                        const expected = item.quantity || 0;
                        const received = item.receivedQuantity || 0;

                        return (
                          <div
                            key={item.shelfTypeId || index}
                            className="flex items-center justify-between hover:bg-white transition-colors"
                          >
                            {/* BÊN TRÁI: IMAGE + THÔNG TIN SẢN PHẨM */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              {/* Image */}
                              <div className="h-14 w-14 rounded-lg border bg-slate-50 flex-shrink-0 overflow-hidden relative shadow-sm">
                                {item?.imageUrl ? (
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.shelfTypeName || ""}
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
                                  {item.shelfTypeName || "N/A"}
                                </h5>

                                <div className="flex items-center gap-2 mt-1.5">
                                  <div className="flex items-center text-[12px] text-slate-500 whitespace-nowrap">
                                    <span className="font-medium">
                                      {item.width}×{item.height}×{item.depth}
                                    </span>
                                  </div>

                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>

                                  <div className="flex items-center gap-1 text-[12px]">
                                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="font-semibold text-slate-700">
                                      {item.totalLevels} tầng
                                    </span>
                                  </div>
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

                  {(!storeOrderShelfDetail?.items ||
                    storeOrderShelfDetail?.items.length === 0) && (
                    <div className="py-20 text-center text-slate-300">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm italic">Không có dữ liệu kệ</p>
                    </div>
                  )}
                </section>
                {/* SECTION 3: THÔNG TIN VẬN CHUYỂN & ĐIỀU PHỐI */}
                <section>
                  {/* Header có Status */}
                  <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wider">
                    <Truck className="h-4 w-4" /> 3. Trạng thái vận chuyển
                  </div>

                  {shipmentDetailList && shipmentDetailList.length > 0 ? (
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
                                  {shipment.shelfItems?.map((shelf, pIdx) => (
                                    <div
                                      key={pIdx}
                                      className="p-2 flex items-center justify-between gap-4"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <div className="h-8 w-8 rounded border bg-white shrink-0 overflow-hidden relative">
                                          <Image
                                            src={shelf.imageUrl || ""}
                                            alt=""
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          {/* Tên loại kệ */}
                                          <p className="text-[13px] font-bold text-slate-800 truncate uppercase tracking-tight">
                                            {shelf.shelfTypeName}
                                          </p>

                                          <div className="flex items-center gap-2 mt-1.5">
                                            <div className="flex items-center text-[12px] text-slate-500 whitespace-nowrap">
                                              <span className="font-medium">
                                                {shelf.width}×{shelf.height}×
                                                {shelf.depth}
                                              </span>
                                            </div>

                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>

                                            <div className="flex items-center gap-1 text-[12px]">
                                              <Layers className="w-3.5 h-3.5 text-blue-500" />
                                              <span className="font-semibold text-slate-700">
                                                {shelf.totalLevels} tầng
                                              </span>
                                            </div>
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
                                            {shelf.expectedQuantity}
                                          </p>
                                        </div>
                                        <div className="h-4 w-px bg-slate-200" />
                                        <div className="text-center min-w-[30px]">
                                          <p className="text-[8px] text-emerald-600 uppercase font-bold">
                                            Nhận
                                          </p>
                                          <p className="text-xs font-black text-emerald-600">
                                            {shelf.receivedQuantity}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
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
              {storeOrderShelfDetail?.status === "Pending" && (
                <Button
                  variant="success"
                  onClick={handleApprove}
                  className="px-8 border-2"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Chấp nhận
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ViewRefillShelfRequestModalDetail;
