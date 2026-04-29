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
import { Calculator, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { updateMonthlySettlementBankedAPI } from "@/src/services/monthly-settlement.service";
import z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFileToCloudinary } from "@/src/config/cloundinary";
import { ImageUploadField } from "@/src/components/UploadImageField";

type ConfirmPaymentWithImgProps = {
  monthlySettlementId: string;
  isOpen: boolean;
  onClose: () => void;
};

function ConfirmPaymentWithImg({
  monthlySettlementId,
  isOpen,
  onClose,
}: ConfirmPaymentWithImgProps) {
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formSchema = z.object({
    imageFile: z
      .instanceof(File, { message: "Vui lòng chọn hình ảnh" })
      .refine((file) => file.type.startsWith("image/"), "File phải là hình ảnh")
      .refine((file) => file.size <= 5 * 1024 * 1024, "Ảnh tối đa 5MB"),
    imageUrl: z.string().optional(),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageFile: undefined,
      imageUrl: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { imageFile, ...restData } = data;

      const imageUrl = imageFile
        ? await uploadFileToCloudinary(imageFile, "shelf")
        : null;

      await updateMonthlySettlementBankedAPI(
        { receiptUrl: imageUrl },
        monthlySettlementId,
      );

      queryClient.invalidateQueries({
        queryKey: ["monthlySettlement", monthlySettlementId],
      });

      queryClient.invalidateQueries({
        queryKey: ["monthlySettlements"],
      });

      toast.success("Xác nhận thanh toán thành công");

      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Xác nhận thanh toán thất bại"));
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
              Xác nhận thanh toán
            </DialogTitle>
            <DialogDescription className="text-xs px-4">
              Tải lên hình ảnh biên lai thanh toán để xác nhận giao dịch.
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
                <ImageUploadField
                  value={imageFile}
                  preview={imagePreview}
                  error={form.formState.errors.imageFile?.message}
                  onChange={(file, preview) => {
                    if (file) {
                      form.setValue("imageFile", file, {
                        shouldValidate: true,
                      });
                    }
                    setImageFile(file);
                    setImagePreview(preview);
                  }}
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
            Xác nhận thanh toán
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmPaymentWithImg;
