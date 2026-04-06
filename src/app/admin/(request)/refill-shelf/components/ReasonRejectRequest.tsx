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
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, Send, XCircle } from "lucide-react";
import { rejectRefillShelfRequestAPI } from "@/src/services/refill-shelf.service";
import { useState } from "react";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

type ReasonRejectRequestModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function ReasonRejectRequestModal({
  requestId,
  isOpen,
  onClose,
  onSuccess,
}: ReasonRejectRequestModalProps) {
  const queryClient = useQueryClient();

  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleReject() {
    setIsSubmitting(true);
    try {
      await rejectRefillShelfRequestAPI(requestId, rejectReason);

      queryClient.invalidateQueries({
        queryKey: ["refillShelfRequests"],
      });

      toast.success("Từ chối yêu cầu thành công");

      onClose();
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error, "Từ chối yêu cầu thất bại"));
    } finally {
      onClose();
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[400px] border-red-100">
        <DialogHeader className="space-y-3">
          {/* Icon Header */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <div className="text-center space-y-1">
            <DialogTitle className="text-xl font-bold text-red-700">
              Từ chối đơn đặt kệ
            </DialogTitle>
            <DialogDescription>
              Vui lòng cung cấp lý do cụ thể để chủ cửa hàng có thể điều chỉnh
              lại thông tin.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Lý do từ chối <span className="text-red-500">*</span>
          </label>
          <input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối đơn hàng..."
            className="w-full text-sm mt-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 resize-none outline-none focus:ring-1 focus:ring-red-200 focus:border-red-400 transition-all placeholder:text-slate-300"
          />
        </div>

        <DialogFooter className="flex sm:justify-between gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 gap-2"
          >
            <XCircle className="h-4 w-4" /> Huỷ
          </Button>
          <Button
            onClick={handleReject}
            disabled={isSubmitting || !rejectReason.trim()}
            className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReasonRejectRequestModal;
