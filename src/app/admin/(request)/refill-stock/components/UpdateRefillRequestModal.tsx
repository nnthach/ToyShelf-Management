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
  formatStoreCreateRequestStatusColor,
  formatStoreCreateRequestStatusText,
} from "@/src/utils/formatStatus";
import {
  Store,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";
import {
  approveRefillRequestAPI,
  getRefillDetailAPI,
  rejectRefillRequestAPI,
} from "@/src/services/refill.service";
import { RefillRequestProductColor } from "@/src/types";
import { useState } from "react";
import AssignWarehouseModal from "./AssignWarehouseModal";

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
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0 overflow-hidden">
          <div className="p-6 border-b">
            <DialogHeader>
              <DialogTitle>Chi tiết yêu cầu bổ sung hàng</DialogTitle>
              <DialogDescription>
                Mã yêu cầu:{" "}
                <span className="font-mono font-bold text-primary">
                  {requestDetail?.code}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden">
              {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
              <div className="w-1/2 border-r p-6 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Store className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-none">
                        {requestDetail?.name || "Cửa hàng"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Yêu cầu bổ sung hàng
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${formatStoreCreateRequestStatusColor(requestDetail?.status)}`}
                  >
                    {formatStoreCreateRequestStatusText(requestDetail?.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Địa chỉ kinh doanh
                    </p>
                    <p className="text-sm font-medium leading-snug bg-muted/30 p-2 rounded-md border border-dashed text-pretty">
                      {requestDetail?.storeAddress || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Số điện thoại
                    </p>
                    <p className="text-sm font-semibold">
                      {requestDetail?.phoneNumber || "N/A"}
                    </p>
                  </div>

                  {!isPending && (
                    <>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> Người duyệt
                        </p>
                        <p className="text-sm font-semibold text-blue-600">
                          {requestDetail?.approvedByUserId ||
                            requestDetail?.rejectedByUserId ||
                            "Hệ thống"}
                        </p>
                      </div>
                      <div className="space-y-1 border-t pt-3 mt-1">
                        <p className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Thời gian xử lý
                        </p>
                        <p className="text-sm italic text-muted-foreground">
                          {requestDetail?.approvedAt ||
                            requestDetail?.rejectedAt ||
                            "N/A"}
                        </p>
                      </div>
                    </>
                  )}

                  {isRejected && (
                    <div className="relative overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                      <div className="absolute left-0 top-0 h-full w-1 bg-destructive"></div>
                      <p className="text-xs font-bold uppercase text-destructive mb-1">
                        Lý do từ chối
                      </p>
                      <p className="text-sm leading-relaxed text-destructive/90 italic">
                        {requestDetail?.rejectReason ||
                          "Không có lý do cụ thể."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
              <div className="w-1/2 flex flex-col bg-muted/10 overflow-hidden">
                <div className="p-4 border-b bg-white flex items-center gap-2 sticky top-0 z-10">
                  <Package className="h-4 w-4 text-primary" />
                  <h4 className="font-bold text-sm uppercase">
                    Danh sách sản phẩm ({requestDetail?.items?.length || 0})
                  </h4>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {requestDetail?.items?.map(
                    (item: RefillRequestProductColor, index: number) => (
                      <div
                        key={item.productColorId || index}
                        className="bg-white border rounded-lg p-3 shadow-sm hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-sm text-foreground uppercase tracking-tight">
                            {item.productName}
                          </p>
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded font-mono">
                            {item.color}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground italic">
                              Số lượng yêu cầu
                            </p>
                            <p className="font-semibold text-lg">
                              {item.quantity}
                            </p>
                          </div>
                          <div className="h-8 w-[1px] bg-border mx-4"></div>
                          <div className="space-y-1 text-right">
                            <p className="text-xs text-muted-foreground italic">
                              Đã đáp ứng
                            </p>
                            <p
                              className={`font-semibold text-lg ${Number(item.fulfilledQuantity) > 0 ? "text-green-600" : "text-muted-foreground"}`}
                            >
                              {item.fulfilledQuantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  )}

                  {(!requestDetail?.items ||
                    requestDetail.items.length === 0) && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                      <Package className="h-12 w-12 mb-2" />
                      <p className="text-sm">Không có sản phẩm nào</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border-t bg-white">
            <DialogFooter className="flex-row gap-2 justify-end">
              {isPending && (
                <>
                  <Button
                    variant={"error"}
                    onClick={handleReject}
                    className="flex-1 sm:flex-none gap-2"
                  >
                    <XCircle className="h-4 w-4" /> Từ chối
                  </Button>
                  <Button
                    variant={"success"}
                    onClick={() => setIsOpenAssignWarehouseModal(true)}
                    className="flex-1 sm:flex-none gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Chấp nhận
                  </Button>
                </>
              )}

              {isRejected && (
                <Button
                  variant={"success"}
                  onClick={() => setIsOpenAssignWarehouseModal(true)}
                  className="w-full sm:w-auto gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" /> Chấp nhận lại
                </Button>
              )}

              {!isRejected && !isPending && (
                <Button
                  variant={"error"}
                  onClick={handleReject}
                  className="w-full sm:w-auto gap-2"
                >
                  <XCircle className="h-4 w-4" /> Từ chối yêu cầu
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
