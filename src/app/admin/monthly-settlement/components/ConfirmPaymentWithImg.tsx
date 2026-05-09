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
import { Calculator, CheckCircle2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { updateMonthlySettlementBankedAPI } from "@/src/services/monthly-settlement.service";
import z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFileToCloudinary } from "@/src/config/cloundinary";
import { ImageUploadField } from "@/src/components/UploadImageField";
import Image from "next/image";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const formSchema = z.object({
    imageFile: z
      .instanceof(File, { message: "Vui lòng chọn hình ảnh" })
      .refine((file) => file.type.startsWith("image/"), "File phải là hình ảnh")
      .refine((file) => file.size <= 5 * 1024 * 1024, "Ảnh tối đa 5MB")
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageFile: undefined,
    },
  });

  const imageFile = form.watch("imageFile");
  const preview = imageFile ? URL.createObjectURL(imageFile) : null;

  // ✅ chọn ảnh
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("imageFile", file, { shouldValidate: true });

    if (inputRef.current) inputRef.current.value = "";
  };

  // ✅ remove
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    form.setValue("imageFile", undefined);

    if (inputRef.current) inputRef.current.value = "";
  };

  // ✅ submit
  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!data.imageFile) {
      toast.error("Chưa chọn ảnh");
      return;
    }
    setIsSubmitting(true);
    try {
      const imageUrl = await uploadFileToCloudinary(data?.imageFile, "receipt");

      await updateMonthlySettlementBankedAPI(
        { receiptUrl: imageUrl },
        monthlySettlementId,
      );

      queryClient.invalidateQueries({
        queryKey: ["monthlyDetail", monthlySettlementId],
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

  const error = form.formState.errors.imageFile?.message;

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Xác nhận thanh toán</DialogTitle>
          <DialogDescription>
            Tải lên hình ảnh biên lai thanh toán
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Image */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Hình ảnh</span>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleSelectImage}
              />

              <div
                onClick={() => !preview && inputRef.current?.click()}
                className="relative h-72 w-full border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {preview ? (
                  <>
                    <Image
                      src={preview}
                      alt="preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />

                    <Button
                      type="button"
                      className="absolute top-2 right-2 z-10"
                      variant="outline"
                      onClick={handleRemove}
                    >
                      <Trash2 className="text-red-500" />
                    </Button>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">Thêm hình ảnh</span>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Submit */}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmPaymentWithImg;
