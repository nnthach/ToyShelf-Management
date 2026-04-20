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
import { CheckCircle2, Truck, Info, Package, Loader2 } from "lucide-react";
import { getShipmentAssignDetailByIdAPI } from "@/src/services/shipment-assignment.service";
import {
  createShipmentAPI,
  getShipmentDetailByAssignmentIdAPI,
  warehouseReceiveReturnShipmentAPI,
} from "@/src/services/shipment.service";
import AssignShipperModal from "./AssignShipperModal";
import CreateShipmentModal from "./CreateShipmentModal";
import WarehouseShipmentStoreInfo from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentStoreInfo";
import WarehouseShipmentDetailSection from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentDetailSection";
import WarehouseShipmentProductList from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentProductList";
import WarehouseShipmentShelfList from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentShelfList";
import WarehouseShipmentDamageList from "@/src/components/WarehouseShipmentModalComponent/WarehouseShipmentDamageList";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

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
  const [isDamaging, setIsDamaging] = useState(false);

  const { data: shipmentAssignDetail, isLoading } = useQuery({
    queryKey: ["shipmentAssignRequest", requestId],
    queryFn: () => getShipmentAssignDetailByIdAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId && isOpen,
  });

  const { data: shipmentDetail, isLoading: isLoadingShipment } = useQuery({
    queryKey: ["shipment", requestId],
    queryFn: () => {
      return getShipmentDetailByAssignmentIdAPI(requestId);
    },
    select: (res) => res.data[0],
    enabled: !!requestId && isOpen,
  });

  // receive return
  const receiveReturnMutation = useMutation({
    mutationFn: () => warehouseReceiveReturnShipmentAPI(shipmentDetail.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipmentAssigns"] });
      queryClient.invalidateQueries({
        queryKey: ["shipmentAssign", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipment", requestId],
      });
      toast.success("Nhận hàng trả thành công");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Nhận hàng trả thất bại"));
    },
  });
  const handleReceiveReturn = async () => {
    receiveReturnMutation.mutate();
  };

  // tạo đơn thu hồi ordertype = damage
  const handleCreateDamageShipment = async () => {
    setIsDamaging(true);
    try {
      await createShipmentAPI({ shipmentAssignmentId: requestId });
      queryClient.invalidateQueries({ queryKey: ["shipmentAssignRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["shipmentAssignRequest", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipment", requestId],
      });
      toast.success("Tạo đơn thành công");
    } catch (error) {
      toast.error(getErrorMessage(error, "Tạo đơn thất bại"));
    } finally {
      setIsDamaging(false);
    }
  };

  const isPending = shipmentAssignDetail?.status === "Pending";
  const isAccepted = shipmentAssignDetail?.status === "Accepted";
  const isAssigned = shipmentAssignDetail?.status === "Assigned";

  const hasDelivery =
    shipmentAssignDetail?.orderType?.includes("STORE") ||
    shipmentAssignDetail?.orderType?.includes("SHELF");
  const hasDamage = shipmentAssignDetail?.orderType?.includes("DAMAGE");

  const columnSize = hasDelivery && hasDamage ? "col-span-4" : "col-span-6";

  const getStatusMessage = () => {
    if (isPending && !shipmentAssignDetail?.shipperName)
      return "Hãy chọn nhân viên giao hàng";
    if (isAssigned) return "Hãy chờ nhân viên giao hàng xác nhận";
    if (isPending) return "Hãy chờ nhân viên giao hàng xác nhận";
    if (shipmentAssignDetail?.orderType === "DAMAGE" && !shipmentDetail)
      return "Hãy tạo đơn để nhân viên thu hồi";
    if (isAccepted && !shipmentDetail) return "Hãy t";
    if (shipmentDetail) return "Đã xuất kho và tạo đơn giao hàng";

    return "Xác nhận số thực tế trước khi xuất kho.";
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          if (!value) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[1200px] w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden gap-0">
          <div className="p-4 border-b bg-muted/5">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Điều phối vận chuyển:{" "}
                    {shipmentAssignDetail?.orderType === "DAMAGE"
                      ? shipmentAssignDetail?.damageReports[0].code
                      : shipmentAssignDetail?.orderType === "SHELF"
                        ? shipmentAssignDetail?.shelfOrders[0].code
                        : shipmentAssignDetail?.storeOrders[0].code || "N/A"}
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
                <div
                  className={`${columnSize} p-6 space-y-8 border-r overflow-y-auto custom-scrollbar`}
                >
                  <WarehouseShipmentStoreInfo
                    shipmentAssignDetail={shipmentAssignDetail}
                  />
                  <WarehouseShipmentDetailSection
                    shipmentDetail={shipmentDetail}
                  />
                </div>

                {/* CỘT PHẢI: DANH SÁCH hàng giao */}
                {hasDelivery && (
                  <div
                    className={`${columnSize} flex flex-col bg-slate-50/50 overflow-hidden border-r`}
                  >
                    <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <h4 className="font-bold text-sm uppercase">
                          Hàng giao
                        </h4>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                      {shipmentAssignDetail?.orderType?.includes("STORE") && (
                        <WarehouseShipmentProductList
                          shipmentAssignDetail={shipmentAssignDetail}
                          shipmentDetail={shipmentDetail}
                        />
                      )}
                      {shipmentAssignDetail?.orderType?.includes("SHELF") && (
                        <WarehouseShipmentShelfList
                          shipmentAssignDetail={shipmentAssignDetail}
                          shipmentDetail={shipmentDetail}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/*Cột phải cuối hàng nhận */}
                {hasDamage && (
                  <div
                    className={`${columnSize} flex flex-col bg-slate-50/50 overflow-hidden`}
                  >
                    <WarehouseShipmentDamageList
                      shipmentAssignDetail={shipmentAssignDetail}
                      shipmentDetail={shipmentDetail}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-4 border-t bg-white">
            <DialogFooter className="flex flex-row items-center justify-between w-full sm:justify-between gap-4">
              {/* BÊN TRÁI: THẺ GHI CHÚ (NOTES) - Chỉ chiếm không gian cần thiết */}
              <div className="flex-1">
                {((shipmentDetail && shipmentDetail?.status !== "Shipping") ||
                  shipmentDetail?.status !== "Delivered") && (
                  <div className="hidden md:flex items-center gap-3 bg-blue-50/80 px-4 py-2.5 rounded-2xl border border-blue-100/50 shadow-sm w-fit">
                    <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm shadow-blue-200 shrink-0">
                      <Info size={14} className="text-white animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider leading-none mb-1">
                        Hướng dẫn điều phối
                      </p>
                      <p className="text-[13px] text-blue-800 font-medium italic line-clamp-1">
                        {getStatusMessage()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* BÊN PHẢI: CÁC NÚT ACTIONS - Gom cụm lại bên phải */}
              <div className="flex items-center gap-3 shrink-0">
                {isPending && (
                  <Button
                    variant="success"
                    disabled={isLoading}
                    onClick={() => setIsOpenAssignShipperModal(true)}
                    className="px-6 h-11 rounded-xl font-bold shadow-lg shadow-green-100 transition-all hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Chọn nhân viên
                    giao hàng
                  </Button>
                )}

                {!isPending && isAccepted && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      onClick={onClose}
                      className="px-6 h-11 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Đóng
                    </Button>

                    {!shipmentDetail &&
                      shipmentAssignDetail.orderType !== "DAMAGE" && (
                        <Button
                          variant="success"
                          disabled={isLoading}
                          onClick={() => setIsOpenCreateShipmentModal(true)}
                          className="px-8 h-11 rounded-xl font-bold bg-green-600 shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:scale-[1.02]"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Tạo đơn giao
                          hàng
                        </Button>
                      )}

                    {shipmentDetail?.status === "DeliveredReturn" && (
                      <Button
                        variant="success"
                        disabled={receiveReturnMutation.isPending}
                        onClick={handleReceiveReturn}
                        className="px-8 h-11 rounded-xl font-bold bg-green-600 shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:scale-[1.02]"
                      >
                        {receiveReturnMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Đã nhận hàng trả về
                      </Button>
                    )}

                    {!shipmentDetail &&
                      shipmentAssignDetail.orderType === "DAMAGE" && (
                        <Button
                          variant="success"
                          disabled={isDamaging}
                          onClick={handleCreateDamageShipment}
                          className="px-8 h-11 rounded-xl font-bold bg-green-600 shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:scale-[1.02]"
                        >
                          {isDamaging ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Tạo đơn bắt đầu thu hồi
                        </Button>
                      )}
                  </div>
                )}
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AssignShipperModal
        requestId={requestId}
        isOpen={isOpenAssignShipperModal}
        onClose={() => setIsOpenAssignShipperModal(false)}
        onSuccess={onClose}
      />

      <CreateShipmentModal
        shipmentAssignDetail={shipmentAssignDetail}
        isOpen={isOpenCreateShipmentModal}
        onClose={() => setIsOpenCreateShipmentModal(false)}
        onSuccess={onClose}
      />
    </>
  );
}

export default memo(UpdateShipmentAssignRefillRequestModal);
