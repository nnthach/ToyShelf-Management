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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  formatShipmentAssignStatusColor,
  formatShipmentAssignStatusText,
} from "@/src/utils/formatStatus";
import { memo, useState } from "react";
import { CheckCircle2, XCircle, Truck, Info, Package } from "lucide-react";
import {
  getShipmentAssignDetailByIdAPI,
  rejectShipmentAssignAPI,
} from "@/src/services/shipment-assignment.service";
import { getShipmentDetailByAssignmentIdAPI } from "@/src/services/shipment.service";
import AssignShipperModal from "./AssignShipperModal";
import CreateShipmentModal from "./CreateShipmentModal";
import WarehouseShipmentStoreInfo from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentStoreInfo";
import WarehouseShipmentDetailSection from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentDetailSection";
import WarehouseShipmentProductList from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentProductList";
import WarehouseShipmentShelfList from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentShelfList";
import CreateShipmentShelfModal from "./CreateShipmentShelfModal";

type UpdateShipmentAssignRefillRequestModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
};

function UpdateShipmentAssignRefillRequestModal({
  requestId,
  isOpen,
  onClose,
}: UpdateShipmentAssignRefillRequestModalProps) {
  const queryClient = useQueryClient();

  const [isOpenAssignShipperModal, setIsOpenAssignShipperModal] =
    useState(false);
  const [isOpenCreateShipmentModal, setIsOpenCreateShipmentModal] =
    useState(false);

  const { data: shipmentAssignDetail, isLoading } = useQuery({
    queryKey: ["shipmentAssignRequest", requestId],
    queryFn: () => getShipmentAssignDetailByIdAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  const { data: shipmentDetail, isLoading: isLoadingShipment } = useQuery({
    queryKey: ["shipment", requestId],
    queryFn: () => {
      return getShipmentDetailByAssignmentIdAPI(requestId);
    },
    select: (res) => res.data[0],
    enabled: !!requestId,
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectShipmentAssignAPI(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipmentAssigns"] });
      queryClient.invalidateQueries({
        queryKey: ["shipmentAssign", requestId],
      });
      toast.success("Từ chối yêu cầu thành công");
    },
    onError: (error) => {
      console.error("Accept error:", error);
      toast.error("Từ chối yêu cầu thất bại");
    },
  });
  const handleReject = async () => {
    rejectMutation.mutate();
  };

  const isPending = shipmentAssignDetail?.status === "Pending";
  const isAccepted = shipmentAssignDetail?.status === "Accepted";

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          if (!value) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[1000px] w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b bg-muted/5">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Điều phối vận chuyển: {shipmentAssignDetail?.storeOrderCode}
                  </DialogTitle>
                  <DialogDescription>
                    Quản lý lộ trình và xác nhận bàn giao hàng hóa
                  </DialogDescription>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold uppercase mr-10 ${formatShipmentAssignStatusColor(shipmentAssignDetail?.status)}`}
                >
                  {formatShipmentAssignStatusText(shipmentAssignDetail?.status)}
                </span>
              </div>
            </DialogHeader>
          </div>

          {/*Main content */}
          <div className="flex-1 overflow-hidden bg-white">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                  <p className="text-sm">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : !shipmentAssignDetail ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <Package className="h-10 w-10 opacity-20" />
                <p className="text-sm italic">Không có dữ liệu</p>
              </div>
            ) : (
              <div className="grid grid-cols-12 h-full">
                {/* CỘT TRÁI: THÔNG TIN CHI TIẾT (7 columns) */}
                <div className="col-span-6 p-6 space-y-8 border-r overflow-y-auto custom-scrollbar">
                  {/* Section 1: Thông tin Điều phối (Shipment Assign) */}
                  <WarehouseShipmentStoreInfo
                    shipmentAssignDetail={shipmentAssignDetail}
                  />

                  {/* Section 2: Thông tin Vận chuyển (Shipment Detail) */}
                  <WarehouseShipmentDetailSection
                    shipmentDetail={shipmentDetail}
                  />
                </div>

                {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM (5 columns) */}
                <div className="col-span-6 flex flex-col bg-slate-50/50 overflow-hidden">
                  {shipmentAssignDetail?.orderType === "STORE" ? (
                    <WarehouseShipmentProductList
                      shipmentAssignDetail={shipmentAssignDetail}
                      shipmentDetail={shipmentDetail}
                    />
                  ) : (
                    <WarehouseShipmentShelfList
                      shipmentAssignDetail={shipmentAssignDetail}
                      shipmentDetail={shipmentDetail}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-4 border-t bg-white">
            <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
              {/* BÊN TRÁI: THẺ GHI CHÚ (NOTES) */}
              {(shipmentDetail && shipmentDetail?.status !== "Shipping") ||
                (shipmentDetail?.status !== "Delivered" && (
                  <div className="hidden md:flex items-center gap-3 bg-blue-50/80 px-4 py-2.5 rounded-2xl border border-blue-100/50 shadow-sm">
                    <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm shadow-blue-200">
                      <Info size={14} className="text-white animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider leading-none mb-1">
                        Hướng dẫn điều phối
                      </p>
                      <p className="text-[14px] text-blue-800 font-medium italic">
                        {isPending && !shipmentAssignDetail?.shipperName
                          ? "Hãy chọn nhân viên giao hàng"
                          : isPending
                            ? "Hãy chờ nhân viên giao hàng xác nhận"
                            : isAccepted && !shipmentDetail
                              ? "Hãy xác nhận xuất kho"
                              : shipmentDetail
                                ? "Đã xuất kho và tạo đơn giao hàng, chờ giao hàng"
                                : "Xác nhận số lượng thực tế trước khi xuất kho cho Shipper."}
                      </p>
                    </div>
                  </div>
                ))}

              {/* BÊN PHẢI: CÁC NÚT ACTIONS (NHƯ CŨ) */}
              <div className="flex items-center gap-3">
                {isPending && (
                  <>
                    <Button
                      variant="error"
                      disabled={isLoading}
                      onClick={handleReject}
                      className="px-6 h-11 rounded-xl font-bold shadow-sm"
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Từ chối
                    </Button>
                    <Button
                      variant="success"
                      disabled={isLoading}
                      onClick={() => setIsOpenAssignShipperModal(true)}
                      className="px-6 h-11 rounded-xl font-bold shadow-lg shadow-green-100 transition-all hover:scale-[1.02]"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Chọn nhân viên
                      giao hàng
                    </Button>
                  </>
                )}

                {!isPending && isAccepted && (
                  <>
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      onClick={onClose}
                      className="px-6 h-11 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-white"
                    >
                      Đóng
                    </Button>
                    {!shipmentDetail && (
                      <Button
                        variant="success"
                        disabled={isLoading}
                        onClick={() => setIsOpenCreateShipmentModal(true)}
                        className="px-8 h-11 rounded-xl font-bold bg-green-600 shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Tạo đơn giao
                        hàng và xuất kho
                      </Button>
                    )}
                  </>
                )}
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject reason modal */}
      <AssignShipperModal
        requestId={requestId}
        isOpen={isOpenAssignShipperModal}
        onClose={() => setIsOpenAssignShipperModal(false)}
        onSuccess={onClose}
      />

      {shipmentAssignDetail?.orderType === "STORE" ? (
        <CreateShipmentModal
          requestId={requestId}
          items={shipmentAssignDetail?.productItems || []}
          isOpen={isOpenCreateShipmentModal}
          onClose={() => setIsOpenCreateShipmentModal(false)}
          onSuccess={onClose}
        />
      ) : (
        <CreateShipmentShelfModal
          requestId={requestId}
          items={shipmentAssignDetail?.shelfItems || []}
          isOpen={isOpenCreateShipmentModal}
          onClose={() => setIsOpenCreateShipmentModal(false)}
          onSuccess={onClose}
        />
      )}
    </>
  );
}

export default memo(UpdateShipmentAssignRefillRequestModal);
