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
import { memo, ReactNode, useState } from "react";
import {
  Store,
  User,
  CheckCircle2,
  XCircle,
  UserCheck,
  Truck,
  ArrowRight,
  Package,
  Calendar,
  Info,
} from "lucide-react";
import {
  getShipmentAssignDetailByIdAPI,
  rejectShipmentAssignAPI,
} from "@/src/services/shipment-assignment.service";
import { RefillRequestProductColor } from "@/src/types";
import { getShipmentDetailByAssignmentIdAPI } from "@/src/services/shipment.service";
import AssignShipperModal from "./AssignShipperModal";
import CreateShipmentModal from "./CreateShipmentModal";

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
    select: (res) => res.data,
    enabled: !!requestId,
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectShipmentAssignAPI(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipmentAssigns"] });
      queryClient.invalidateQueries({
        queryKey: ["shipmentAssign", requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["shipment", requestId] });
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
        <DialogContent className="sm:max-w-[1200px] w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden">
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

          <div className="flex flex-1 overflow-hidden bg-slate-50">
            {/* CỘT 1: THÔNG TIN YÊU CẦU (REQUEST INFO) */}
            <div className="w-1/4 border-r bg-white p-4 overflow-y-auto space-y-5">
              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5" /> Thông tin cơ bản
              </h4>

              <div className="space-y-4">
                <DetailItem
                  label="Người yêu cầu"
                  value={String(shipmentAssignDetail?.createdByName)}
                  icon={<User className="h-3 w-3" />}
                />
                <DetailItem
                  label="Cửa hàng yêu cầu"
                  value={String(shipmentAssignDetail?.storeLocationName)}
                  icon={<Store className="h-3 w-3" />}
                  color="text-blue-600 font-bold"
                />
                <DetailItem
                  label="Người duyệt/Giao việc"
                  value={shipmentAssignDetail?.assignedByName || "Chưa có"}
                  icon={<UserCheck className="h-3 w-3" />}
                />
                <DetailItem
                  label="Thời gian tạo"
                  value={
                    shipmentAssignDetail?.createdAt
                      ? new Date(
                          shipmentAssignDetail.createdAt,
                        ).toLocaleString()
                      : "---"
                  }
                  icon={<Calendar className="h-3 w-3" />}
                />
              </div>
            </div>

            {/* CỘT 2: DANH SÁCH SẢN PHẨM DỰ KIẾN (ASSIGNMENT ITEMS) */}
            <div className="w-1/3 border-r bg-white p-4 flex flex-col overflow-hidden">
              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2 mb-4">
                <Package className="h-3.5 w-3.5" /> Sản phẩm yêu cầu (
                {shipmentAssignDetail?.items?.length || 0})
              </h4>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {shipmentAssignDetail?.items?.map(
                  (item: RefillRequestProductColor, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-lg bg-slate-50/50 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-bold uppercase leading-none">
                          {item.productName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                          {item.color}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          SL:{" "}
                          <span className="text-sm font-bold text-foreground">
                            {item.quantity}
                          </span>
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* CỘT 3: THÔNG TIN VẬN CHUYỂN (SHIPMENT PROGRESS) */}
            <div className="w-[41.6%] bg-slate-50 p-4 overflow-y-auto space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                <Truck className="h-3.5 w-3.5" /> Tiến độ giao hàng thực tế
              </h4>

              {!shipmentDetail ? (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
                  <Truck className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm italic">
                    Thông tin vận chuyển sẽ hiển thị
                  </p>
                  <p className="text-[10px]">sau khi yêu cầu được duyệt</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Lộ trình */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-[10px] uppercase text-muted-foreground font-bold text-center">
                          Từ kho
                        </p>
                        <p className="text-sm font-semibold text-center truncate">
                          {shipmentDetail.fromLocationName}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
                      <div className="flex-1">
                        <p className="text-[10px] uppercase text-muted-foreground font-bold text-center">
                          Đến cửa hàng
                        </p>
                        <p className="text-sm font-semibold text-center truncate">
                          {shipmentDetail.toLocationName}
                        </p>
                      </div>
                    </div>
                    <div className="h-[1px] bg-slate-100 w-full" />
                    <DetailItem
                      label="Nhân viên giao hàng"
                      value={shipmentDetail.shipperName}
                      icon={<Truck className="h-3 w-3" />}
                    />
                  </div>

                  {/* Các mốc thời gian */}
                  <div className="grid grid-cols-2 gap-2">
                    <TimeBox
                      label="Lấy hàng"
                      time={shipmentDetail.pickedUpAt}
                    />
                    <TimeBox
                      label="Giao xong"
                      time={shipmentDetail.deliveredAt}
                    />
                  </div>

                  {/* Đối soát số lượng thực nhận */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-slate-500">
                      Đối soát thực tế
                    </p>
                    {shipmentDetail.items?.map(
                      (item: RefillRequestProductColor, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white p-2 border rounded flex items-center justify-between text-xs"
                        >
                          <span className="font-medium truncate max-w-[150px]">
                            {item.productName}
                          </span>
                          <div className="flex gap-4">
                            <span className="text-muted-foreground">
                              Dự kiến: <b>{item.expectedQuantity}</b>
                            </span>
                            <span
                              className={
                                Number(item.receivedQuantity) <
                                Number(item.expectedQuantity)
                                  ? "text-red-500 font-bold"
                                  : "text-green-600 font-bold"
                              }
                            >
                              Thực nhận: {item.receivedQuantity}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-4 border-t bg-white">
            <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
              {/* BÊN TRÁI: THẺ GHI CHÚ (NOTES) */}
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
                        : isAccepted
                          ? "Hãy xác nhận xuất kho"
                          : '"Xác nhận số lượng thực tế trước khi xuất kho cho Shipper."'}
                  </p>
                </div>
              </div>

              {/* BÊN PHẢI: CÁC NÚT ACTIONS (NHƯ CŨ) */}
              <div className="flex items-center gap-3">
                {isPending && (
                  <>
                    <Button
                      variant="error"
                      onClick={handleReject}
                      className="px-6 h-11 rounded-xl font-bold shadow-sm"
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Từ chối
                    </Button>
                    <Button
                      variant="success"
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
                      onClick={onClose}
                      className="px-6 h-11 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-white"
                    >
                      Đóng
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => setIsOpenCreateShipmentModal(true)}
                      className="px-8 h-11 rounded-xl font-bold bg-green-600 shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Xác nhận xuất
                      kho
                    </Button>
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

      <CreateShipmentModal
        requestId={requestId}
        items={shipmentAssignDetail?.items || []}
        isOpen={isOpenCreateShipmentModal}
        onClose={() => setIsOpenCreateShipmentModal(false)}
        onSuccess={onClose}
      />
    </>
  );
}

const DetailItem = ({
  label,
  value,
  icon,
  color = "text-foreground",
}: {
  label: string;
  value: string;
  icon: ReactNode;
  color?: string;
}) => (
  <div className="space-y-1">
    <p className="text-[10px] font-medium uppercase text-muted-foreground flex items-center gap-1">
      {icon} {label}
    </p>
    <p className={`text-sm ${color}`}>{value || "---"}</p>
  </div>
);

const TimeBox = ({ label, time }: { label: string; time: string }) => (
  <div className="bg-white p-2 border rounded-lg">
    <p className="text-[9px] uppercase font-bold text-muted-foreground">
      {label}
    </p>
    <p className="text-[11px] font-medium">
      {time ? new Date(time).toLocaleTimeString() : "Chưa có"}
    </p>
  </div>
);

export default memo(UpdateShipmentAssignRefillRequestModal);
