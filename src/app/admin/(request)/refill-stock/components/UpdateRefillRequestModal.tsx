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
  getStoreCreationRequestDetailAPI,
  reviewStoreCreationRequestAPI,
} from "@/src/services/store-create-request.service";
import {
  formatStoreCreateRequestStatusColor,
  formatStoreCreateRequestStatusText,
} from "@/src/utils/formatStatus";
import ReasonStoreCreateRequestModal from "./ReasonRefillRequestModal";
import { useState } from "react";
import {
  Store,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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

  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);

  const { data: requestDetail, isLoading } = useQuery({
    queryKey: ["requestDetail", requestId],
    queryFn: () => getStoreCreationRequestDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  async function handleApprove() {
    try {
      await reviewStoreCreationRequestAPI({ status: "Approved" }, requestId);

      queryClient.invalidateQueries({
        queryKey: ["storeRequests"],
      });

      toast.success("Chấp nhận yêu cầu thành công");

      onClose();
    } catch {
      toast.error("Chấp nhận yêu cầu thất bại");
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu tạo cửa hàng</DialogTitle>
            <DialogDescription>
              Xem thông tin yêu cầu trước khi phê duyệt.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6 py-2">
              {/* Header Info: Store Name & Status */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-none">
                      {requestDetail?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yêu cầu tạo cửa hàng mới
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${formatStoreCreateRequestStatusColor(requestDetail?.status)}`}
                >
                  {formatStoreCreateRequestStatusText(requestDetail?.status)}
                </span>
              </div>

              {/* Main Details Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Địa chỉ kinh doanh
                  </p>
                  <p className="text-sm font-medium leading-snug bg-muted/30 p-2 rounded-md border border-dashed">
                    {requestDetail?.storeAddress}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Số điện thoại
                  </p>
                  <p className="text-sm font-semibold">
                    {requestDetail?.phoneNumber}
                  </p>
                </div>

                {/* Thông tin xét duyệt (Nếu có) */}
                {!isPending && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> Người duyệt
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        {requestDetail?.reviewedByUserId}
                      </p>
                    </div>
                    <div className="sm:col-span-2 space-y-1 border-t pt-3 mt-1">
                      <p className="text-xs font-medium uppercase text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Thời gian xử lý
                      </p>
                      <p className="text-sm italic text-muted-foreground">
                        {requestDetail?.reviewedAt}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Reject Reason Section */}
              {isRejected && (
                <div className="relative overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="absolute left-0 top-0 h-full w-1 bg-destructive"></div>
                  <p className="text-xs font-bold uppercase text-destructive mb-1">
                    Lý do từ chối
                  </p>
                  <p className="text-sm leading-relaxed text-destructive/90 italic">
                    {requestDetail?.rejectReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {isPending && (
            <DialogFooter className="gap-2 pt-4">
              <Button
                variant={"error"}
                onClick={() => setIsOpenRejectModal(true)}
              >
                <XCircle />
                Từ chối
              </Button>
              <Button variant={"success"} onClick={handleApprove}>
                <CheckCircle2 />
                Chấp nhận
              </Button>
            </DialogFooter>
          )}

          {isRejected && (
            <DialogFooter className="gap-2">
              <Button variant={"success"} onClick={handleApprove}>
                <CheckCircle2 />
                Chấp nhận
              </Button>
            </DialogFooter>
          )}

          {!isRejected && !isPending && (
            <DialogFooter className="gap-2">
              <Button
                variant={"error"}
                onClick={() => setIsOpenRejectModal(true)}
              >
                <XCircle />
                Từ chối
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject reason modal */}
      <ReasonStoreCreateRequestModal
        requestId={requestId}
        isOpen={isOpenRejectModal}
        onClose={() => setIsOpenRejectModal(false)}
        onSuccess={onClose}
      />
    </>
  );
}

export default UpdateRefillRequestModal;
