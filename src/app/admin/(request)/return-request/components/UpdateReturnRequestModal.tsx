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
  formatDamageReportStatusColor,
  formatDamageReportStatusText,
} from "@/src/utils/formatStatus";
import { CheckCircle2, Package, XCircle } from "lucide-react";
import { Shipment } from "@/src/types";
import { useState } from "react";
import { getShipmentAssignDetailByDamageReportIdAPI } from "@/src/services/shipment-assignment.service";
import { getShipmentDetailByDamageReportIdAPI } from "@/src/services/shipment.service";
import ReasonRejectRequestModal from "./ReasonRejectRequest";
import {
  adminApproveDamageReportRequestAPI,
  getDamageReportDetailAPI,
} from "@/src/services/damage-report.service";
import DamageReportDetailSection from "@/src/components/ShipmentComponent/DamageReportDetailSection";
import DamageReportItemList from "@/src/components/ShipmentComponent/DamageReportItemList";
import ShipmentAssignDetailDamageSection from "@/src/components/ShipmentComponent/ShipmentAssignDetailDamageSection";
import ShipmentDetailDamageSection from "@/src/components/ShipmentComponent/ShipmentDetailDamageSection";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import AssignWarehouseModal from "./AssignWarehouseModal";

type UpdateReturnRequestModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
};

function UpdateReturnRequestModal({
  requestId,
  isOpen,
  onClose,
}: UpdateReturnRequestModalProps) {
  const queryClient = useQueryClient();

  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);
  const [isOpenAssignWarehouseModal, setIsOpenAssignWarehouseModal] =
    useState(false);

  const { data: requestDetail, isLoading } = useQuery({
    queryKey: ["returnRequest", requestId],
    queryFn: () => getDamageReportDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  const { data: shipmentAssigns, isLoading: isLoadingAssigns } = useQuery({
    queryKey: ["shipmentAssigns", requestId],
    queryFn: () => getShipmentAssignDetailByDamageReportIdAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId && isOpen,
  });

  const { data: shipmentDetail } = useQuery({
    queryKey: ["shipmentDetail", requestId],
    queryFn: () => getShipmentDetailByDamageReportIdAPI(requestId!),
    select: (res) => res.data as Shipment[],
    enabled: !!requestId && isOpen,
  });

  async function handleApprove() {
    try {
      await adminApproveDamageReportRequestAPI(requestId);

      queryClient.invalidateQueries({
        queryKey: ["returnRequest"],
      });

      queryClient.invalidateQueries({
        queryKey: ["shipmentAssigns", requestId],
      });

      toast.success("Hãy điều phối kho thực hiện");
    } catch (error) {
      toast.error(getErrorMessage(error, "Chấp nhận yêu cầu thất bại"));
    }
  }

  const isPartnerApproved = requestDetail?.status === "PartnerApproved";
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
                    Chi tiết đơn trả hàng
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Mã đơn:{" "}
                    <span className="font-mono font-bold text-primary">
                      {requestDetail?.code}
                    </span>
                  </DialogDescription>
                </div>
                <p
                  className={`px-4 py-1.5 mr-4 rounded-full text-sm font-bold shadow-sm ${formatDamageReportStatusColor(requestDetail?.status)}`}
                >
                  {formatDamageReportStatusText(requestDetail?.status)}
                </p>
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
                <div className="col-span-6 h-full overflow-y-auto custom-scrollbar p-6 space-y-8 border-r bg-white">
                  <DamageReportDetailSection
                    damageReportDetail={requestDetail}
                  />
                  <ShipmentAssignDetailDamageSection
                    shipmentAssignments={shipmentAssigns ?? []}
                  />
                  <ShipmentDetailDamageSection
                    shipmentDetail={shipmentDetail}
                  />
                </div>

                <div className="col-span-6 flex flex-col bg-slate-50/50 overflow-hidden">
                  <DamageReportItemList
                    damageItems={requestDetail.items || []}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose} className="border-2">
                Đóng cửa sổ
              </Button>
              {isPartnerApproved && (
                <>
                  <Button
                    variant="error"
                    onClick={() => setIsOpenRejectModal(true)}
                    className="px-8 border-2"
                  >
                    <XCircle className="h-4 w-4" /> Từ chối
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    className="px-8 border-2"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Chấp nhận
                  </Button>
                </>
              )}

              {isApproved &&
                requestDetail.shipmentAssignmentIds.length === 0 && (
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

      {/* Reject reason modal */}
      <ReasonRejectRequestModal
        requestId={requestId}
        isOpen={isOpenRejectModal}
        onClose={() => setIsOpenRejectModal(false)}
        onSuccess={onClose}
      />
    </>
  );
}

export default UpdateReturnRequestModal;
