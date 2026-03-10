"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Edit,
  Layers,
  Plus,
  Sparkles,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { SketchPicker } from "react-color";
import namer from "color-namer";
import {
  createProductColorAPI,
  getProductColorDetailAPI,
  updateProductColorAPI,
} from "@/src/services/product-color.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import {
  getProducePriceSegmentDetailAPI,
  updateProducePriceSegmentAPI,
} from "@/src/services/product-segment.service";

type EditProductPriceSegmentModalProps = {
  priceSegmentId: string;
  isOpen: boolean;
  onClose: () => void;
};

function EditProductPriceSegmentModal({
  priceSegmentId,
  isOpen,
  onClose,
}: EditProductPriceSegmentModalProps) {
  const queryClient = useQueryClient();

  const { data: priceSegmentDetail, isLoading } = useQuery({
    queryKey: ["priceSegment", priceSegmentId],
    queryFn: () => getProducePriceSegmentDetailAPI(priceSegmentId!),
    select: (res) => res.data,
    enabled: !!priceSegmentId,
  });

  const formSchema = z.object({
    name: z.string().min(1, "Tên cấp độ giá là bắt buộc"),
    minPrice: z
      .string()
      .min(1, "Giá tối thiểu là bắt buộc")
      .refine((val) => !isNaN(Number(val)), "Giá tối thiểu phải là số")
      .refine((val) => Number(val) >= 1, "Giá tối thiểu phải >= 1"),
    maxPrice: z
      .string()
      .min(1, "Giá tối đa là bắt buộc")
      .refine((val) => !isNaN(Number(val)), "Giá tối đa phải là số")
      .refine((val) => Number(val) >= 1, "Giá tối đa phải >= 1"),
    code: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      minPrice: "",
      maxPrice: "",
      code: "",
    },
  });

  useEffect(() => {
    if (priceSegmentDetail) {
      form.reset({
        name: priceSegmentDetail.name,
        minPrice: priceSegmentDetail.minPrice.toString(),
        maxPrice: priceSegmentDetail.maxPrice.toString(),
        code: priceSegmentDetail.code,
      });
    }
  }, [priceSegmentDetail, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updateProducePriceSegmentAPI(priceSegmentId, data);

      queryClient.invalidateQueries({
        queryKey: ["productPriceSegments"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["priceSegment", priceSegmentId],
      });

      form.reset();
      toast.success("Chỉnh sửa cấp độ giá mới thành công");
      onClose();
    } catch (error) {
      toast.error("Chỉnh sửa cấp độ giá mới thất bại");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Chỉnh sửa cấp bậc giá sản phẩm
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-blue-500" />
            Phân loại các khoảng giá để quản lý chính sách hoa hồng dễ dàng hơn.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-price-segment"
            >
              {/* TÊN CẤP BẬC */}
              <FormFieldCustom
                name="name"
                label="Tên cấp bậc giá"
                placeholder="Ví dụ: Phân khúc giá rẻ, Cao cấp..."
                icon={<Layers size={18} />}
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* GIÁ TỐI THIỂU */}
                <FormFieldCustom
                  name="minPrice"
                  label="Giá tối thiểu"
                  placeholder="0"
                  type="number"
                  labelNote="(VNĐ)"
                  icon={<ArrowDownWideNarrow size={18} />}
                />

                {/* GIÁ TỐI ĐA */}
                <FormFieldCustom
                  name="maxPrice"
                  label="Giá tối đa"
                  placeholder="Ví dụ: 1,000,000"
                  type="number"
                  labelNote="(VNĐ)"
                  icon={<ArrowUpWideNarrow size={18} />}
                />
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer đồng bộ */}
        <DialogFooter className="p-4 bg-slate-50/50 border-t flex gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 font-medium text-slate-600 hover:bg-slate-200"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-create-price-segment"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Edit className="h-4 w-4" />
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditProductPriceSegmentModal;
