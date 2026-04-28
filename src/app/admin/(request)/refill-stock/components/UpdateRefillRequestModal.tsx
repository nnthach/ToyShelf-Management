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
  formatStoreOrderRefillRequestStatusColor,
  formatStoreOrderRefillRequestStatusText,
} from "@/src/utils/formatStatus";
import { CheckCircle2, Loader2, Package, XCircle } from "lucide-react";
import {
  approveRefillRequestByAdminAPI,
  getRefillDetailAPI,
  rejectRefillRequestAPI,
} from "@/src/services/refill.service";
import { Shipment } from "@/src/types";
import { useState } from "react";
import AssignWarehouseModal from "./AssignWarehouseModal";
import { getShipmentAssignDetailByStoreOrderIdAPI } from "@/src/services/shipment-assignment.service";
import { getShipmentDetailByStoreOrderIdAPI } from "@/src/services/shipment.service";
import ShipmentDetailSection from "@/src/components/ShipmentComponent/ShipmentDetailSection";
import ShipmentAssignDetailSection from "@/src/components/ShipmentComponent/ShipmentAssignDetailSection";
import StoreOrderDetailSection from "@/src/components/ShipmentComponent/StoreOrderDetailSection";
import ShipmentProductListComponent from "@/src/components/ShipmentComponent/ShipmentProductListComponent";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

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

  const [isReviewing, setIsReviewing] = useState(false);

  const { data: requestDetail, isLoading } = useQuery({
    queryKey: ["requestDetail", requestId],
    queryFn: () => getRefillDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId && isOpen,
  });

  const isHasShipmentAssign = requestDetail?.shipmentAssignmentIds?.length > 0;
  // 2. Fetch toàn bộ chi tiết của các assignment cùng lúc
  const { data: shipmentAssigns, isLoading: isLoadingAssigns } = useQuery({
    queryKey: ["shipmentAssigns", requestId],
    queryFn: () => getShipmentAssignDetailByStoreOrderIdAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId && isOpen && isHasShipmentAssign,
  });

  const { data: shipmentDetail, isLoading: isLoadingShipmentDetail } = useQuery({
    queryKey: ["shipmentDetail", requestId],
    queryFn: () => getShipmentDetailByStoreOrderIdAPI(requestId!),
    select: (res) => res.data as Shipment[],
    enabled: !!requestId && isOpen,
  });

  async function handleReject() {
    try {
      await rejectRefillRequestAPI(requestId);

      queryClient.invalidateQueries({
        queryKey: ["refillRequests"],
      });

      toast.success("Từ chối yêu cầu thành công");

      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Từ chối yêu cầu thất bại"));
    }
  }

  async function handleApprove() {
    setIsReviewing(true);
    try {
      await approveRefillRequestByAdminAPI(requestId);

      queryClient.invalidateQueries({
        queryKey: ["refillRequests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["requestDetail", requestId],
      });

      toast.success("Hãy điều phối kho thực hiện");
    } catch (error) {
      toast.error(getErrorMessage(error, "Chấp nhận yêu cầu thất bại"));
    } finally {
      setIsReviewing(false);
    }
  }

  const isPartnerApproved = requestDetail?.status === "PartnerApproved";
  const isRejected = requestDetail?.status === "Rejected";
  const isApproved = requestDetail?.status === "Approved";

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
                    Chi tiết đơn đặt hàng
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Mã đơn:{" "}
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

          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                  <p className="text-sm">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : !requestDetail ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <Package className="h-10 w-10 opacity-20" />
                <p className="text-sm italic">Không có dữ liệu</p>
              </div>
            ) : (
              <div className="grid grid-cols-12 h-full">
                <div className="col-span-7 h-full overflow-y-auto custom-scrollbar p-6 space-y-8 border-r bg-white">
                  <StoreOrderDetailSection storeOrderDetail={requestDetail} />
                  <ShipmentAssignDetailSection
                    shipmentAssignments={shipmentAssigns ?? []}
                    isLoading={isLoadingAssigns}
                  />
                  <ShipmentDetailSection shipmentDetail={shipmentDetail} isLoading={isLoadingShipmentDetail} />
                </div>

                {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM (5 columns) */}
                <div className="col-span-5 flex flex-col bg-slate-50/50 overflow-hidden">
                  <ShipmentProductListComponent
                    storeOrderDetail={requestDetail}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <DialogFooter className="gap-2">
              {isPartnerApproved && (
                <>
                  <Button
                    variant="error"
                    onClick={handleReject}
                    disabled={isReviewing}
                    className="px-8 border-2"
                  >
                    {isReviewing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Từ chối
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    disabled={isReviewing}
                    className="px-8 border-2"
                  >
                    {isReviewing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Chấp nhận
                  </Button>
                </>
              )}
              {isApproved && (
                <Button
                  variant="success"
                  onClick={() => setIsOpenAssignWarehouseModal(true)}
                  className="px-8 shadow-lg shadow-green-200"
                >
                  <CheckCircle2 className="h-4 w-4" /> Điều phối kho
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
