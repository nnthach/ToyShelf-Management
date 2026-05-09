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
import {
  Banknote,
  Calculator,
  CheckCircle2,
  ClipboardEdit,
} from "lucide-react";
import { useState } from "react";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { updateMonthlySettlementAdditionalFeeAPI } from "@/src/services/monthly-settlement.service";
import z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";

type DeductionModalProps = {
  monthlySettlementId: string;
  isOpen: boolean;
  onClose: () => void;
};

function DeductionModal({
  monthlySettlementId,
  isOpen,
  onClose,
}: DeductionModalProps) {
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    deductionAmount: z.number().min(1, "Hãy nhập chi phí khấu trừ"),
    note: z.string().min(1, "Ghi chú là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deductionAmount: 0,
      note: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await updateMonthlySettlementAdditionalFeeAPI(data, monthlySettlementId);

      queryClient.invalidateQueries({
        queryKey: ["monthlyDetail", monthlySettlementId],
      });

      queryClient.invalidateQueries({
        queryKey: ["monthlySettlements"],
      });

      toast.success("Cập nhật khấu trừ thành công");

      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Cập nhật khấu trừ thất bại"));
    } finally {
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
      <DialogContent
        onPointerDownOutside={(e) => e.stopPropagation()}
        onInteractOutside={(e) => e.stopPropagation()}
        className="sm:max-w-[400px] border-blue-50/50 shadow-2xl"
      >
        <DialogHeader className="space-y-3">
          {/* Icon Header - Chuyển sang Blue/Indigo tạo cảm giác tin cậy */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
            <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="text-center space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Điều chỉnh khấu trừ
            </DialogTitle>
            <DialogDescription className="text-xs px-4">
              Nhập số tiền khấu trừ và lý do cụ thể để hệ thống cập nhật lại
              tổng tiền thanh toán cuối cùng.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="px-1 py-4">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="form-deduction-update"
            >
              <div className="grid gap-4">
                <FormFieldCustom
                  name="deductionAmount"
                  label="Số tiền khấu trừ"
                  labelNote="đồng"
                  icon={<Banknote size={18} />}
                  type="number"
                  placeholder="Nhập số tiền... (VD: 50,000)"
                  required
                />

                <FormFieldCustom
                  name="note"
                  label="Lý do khấu trừ"
                  icon={<ClipboardEdit size={18} />}
                  placeholder="Nhập chi tiết lý do điều chỉnh..."
                  required
                />
              </div>
            </form>
          </FormProvider>
        </div>

        <DialogFooter className="flex sm:justify-between gap-3 border-t pt-5 mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 font-semibold text-slate-500 hover:bg-slate-100"
          >
            Đóng
          </Button>
          <Button
            type="submit"
            form="form-deduction-update"
            disabled={isSubmitting}
            className="flex-[1.5] gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 dark:shadow-none transition-all"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Cập nhật chi phí
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeductionModal;
