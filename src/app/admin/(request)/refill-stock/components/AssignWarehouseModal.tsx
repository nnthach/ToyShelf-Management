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
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";

import { reviewStoreCreationRequestAPI } from "@/src/services/store-create-request.service";
import { AlertCircle, Send, XCircle } from "lucide-react";
import { approveRefillRequestAPI } from "@/src/services/refill.service";
import { memo } from "react";

type AssignWarehouseModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function AssignWarehouseModal({
  requestId,
  isOpen,
  onClose,
  onSuccess,
}: AssignWarehouseModalProps) {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    warehouseLocationId: z.string().min(1, "Kho là bắt buộc"),
    storeOrderId: z.string().optional(),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouseLocationId: "Rejected",
      storeOrderId: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await approveRefillRequestAPI(requestId);

      queryClient.invalidateQueries({
        queryKey: ["refillRequests"],
      });

      form.reset();
      toast.success("Cập nhật yêu cầu thành công");
      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Cập nhật yêu cầu thất bại");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
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
              Chọn kho thực hiện
            </DialogTitle>
            <DialogDescription>
              Vui lòng cung cấp lý do cụ thể để chủ cửa hàng có thể điều chỉnh
              lại thông tin.
            </DialogDescription>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="form-reject-request"
            className="py-4"
          >
            <div className="relative group">
              <FormFieldCustom
                name="rejectReason"
                label="Lý do từ chối"
                placeholder="Ví dụ: Địa chỉ cửa hàng không chính xác hoặc thiếu giấy phép..."
              />
            </div>
          </form>
        </FormProvider>

        <DialogFooter className="flex sm:justify-between gap-3 border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 gap-2"
          >
            <XCircle className="h-4 w-4" /> Huỷ
          </Button>
          <Button
            type="submit"
            form="form-reject-request"
            disabled={isSubmitting}
            className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AssignWarehouseModal);
