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
import { toast } from "react-toastify";
import {
  formatShipmentAssignStatusText,
  formatStoreCreateRequestStatusColor,
  formatStoreCreateRequestStatusText,
  formatStoreOrderRefillRequestStatusColor,
  formatStoreOrderRefillRequestStatusText,
} from "@/src/utils/formatStatus";
import {
  Store,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Calendar,
  UserCheck,
  Warehouse,
  Truck,
  ArrowRight,
} from "lucide-react";
import {
  getRefillDetailAPI,
  rejectRefillRequestAPI,
} from "@/src/services/refill.service";
import { RefillRequestProductColor, Shipment } from "@/src/types";
import { useState } from "react";
import AssignWarehouseModal from "./AssignWarehouseModal";
import { getShipmentAssignDetailByIdAPI } from "@/src/services/shipment-assignment.service";
import { getShipmentDetailByIdAPI } from "@/src/services/shipment.service";
import { formatDateTime } from "@/src/utils/format";
import ShipInfoItem from "@/src/components/ShipmentComponent/ShipInfoItem";
import ShipTimeNode from "@/src/components/ShipmentComponent/ShipTimeNode";
import EmptySection from "@/src/components/ShipmentComponent/EmptySection";
import ShipmentDetailSection from "@/src/components/ShipmentComponent/ShipmentDetailSection";
import ShipmentAssignDetailSection from "@/src/components/ShipmentComponent/ShipmentAssignDetailSection";
import StoreOrderDetailSection from "@/src/components/ShipmentComponent/StoreOrderDetailSection";
import ShipmentProductListComponent from "@/src/components/ShipmentComponent/ShipmentProductListComponent";

type UpdateRefillRequestModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
};

function UpdateRefillRequestModal({
  requestId,
  isOpen,
  onClose,
}: UpdateRefillRequestModalProps) {
  const queryClient = useQueryClient();

  const [isOpenAssignWarehouseModal, setIsOpenAssignWarehouseModal] =
    useState(false);

  const { data: requestDetail, isLoading } = useQuery({
    queryKey: ["requestDetail", requestId],
    queryFn: () => getRefillDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  const assignmentId = requestDetail?.shipmentAssignmentIds?.[0];
  const { data: shipmentAssignDetail } = useQuery({
    queryKey: ["shipmentAssignDetail", assignmentId],
    queryFn: () => getShipmentAssignDetailByIdAPI(assignmentId!),
    select: (res) => res.data,
    enabled: !!assignmentId,
  });

  const shipmentId = requestDetail?.shipmentIds?.[0];
  const { data: shipmentDetail } = useQuery({
    queryKey: ["shipmentDetail", shipmentId],
    queryFn: () => getShipmentDetailByIdAPI(shipmentId!),
    select: (res) => res.data as Shipment,
    enabled: !!shipmentId,
  });

  async function handleReject() {
    try {
      await rejectRefillRequestAPI(requestId);

      queryClient.invalidateQueries({
        queryKey: ["refillRequests"],
      });

      toast.success("Từ chối yêu cầu thành công");

      onClose();
    } catch {
      toast.error("Từ chối yêu cầu thất bại");
    }
  }

  const isPending = requestDetail?.status === "Pending";
  const isRejected = requestDetail?.status === "Rejected";

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          if (!value) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[1000px] h-[90vh] flex flex-col p-0 overflow-hidden">
          <div className="p-6 border-b bg-slate-50/50">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-xl">
                    Chi tiết bổ sung hàng
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Mã hệ thống:{" "}
                    <span className="font-mono font-bold text-primary">
                      {requestDetail?.code}
                    </span>
                  </DialogDescription>
                </div>
                <div
                  className={`px-4 py-1.5 mr-4 rounded-full text-sm font-bold shadow-sm ${formatStoreOrderRefillRequestStatusColor(requestDetail?.status)}`}
                >
                  {formatStoreOrderRefillRequestStatusText(
                    requestDetail?.status,
                  )}
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-12 h-full">
              {/* CỘT TRÁI: THÔNG TIN LUỒNG XỬ LÝ (7 columns) */}
              <div className="col-span-7 p-6 space-y-8 border-r">
                {/* Section 1: Thông tin yêu cầu gốc */}
                <StoreOrderDetailSection storeOrderDetail={requestDetail} />

                {/* Section 2: Thông tin điều phối (Assignment) */}
                <ShipmentAssignDetailSection
                  shipmentAssignDetail={shipmentAssignDetail}
                />

                {/* Section 3: Thông tin vận chuyển (Shipment) */}
                <ShipmentDetailSection shipmentDetail={shipmentDetail} />
              </div>

              {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM (5 columns) */}
              <div className="col-span-5 flex flex-col bg-slate-50/50 overflow-hidden">
                <ShipmentProductListComponent
                  shipmentDetail={shipmentDetail}
                  storeOrderDetail={requestDetail}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <DialogFooter className="gap-2">
              {isPending && (
                <>
                  <Button
                    variant="error"
                    onClick={handleReject}
                    className="px-8 border-2"
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Từ chối
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => setIsOpenAssignWarehouseModal(true)}
                    className="px-8 shadow-lg shadow-green-200"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Duyệt & Điều phối
                    kho
                  </Button>
                </>
              )}
              {isRejected && (
                <Button
                  variant="success"
                  onClick={() => setIsOpenAssignWarehouseModal(true)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Chấp nhận lại
                </Button>
              )}
              {!isRejected && !isPending && (
                <Button variant="outline" onClick={onClose}>
                  Đóng cửa sổ
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AssignWarehouseModal
        requestId={requestId}
        isOpen={isOpenAssignWarehouseModal}
        onClose={() => setIsOpenAssignWarehouseModal(false)}
        onSuccess={onClose}
      />
    </>
  );
}

export default UpdateRefillRequestModal;
