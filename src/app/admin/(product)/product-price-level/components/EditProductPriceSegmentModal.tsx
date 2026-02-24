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
import { Plus } from "lucide-react";
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
        minPrice: priceSegmentDetail.minPrice,
        maxPrice: priceSegmentDetail.maxPrice,
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
      console.log("update price segment err", error);
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
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa màu sắc sản phẩm</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mb-2"
              id="form-edit-price-segment"
            >
              <FormFieldCustom
                name="name"
                label="Tên cấp độ giá"
                placeholder="Ví dụ: Cấp độ giá 1"
              />
              <FormFieldCustom
                name="minPrice"
                label="Giá tối thiểu"
                placeholder="Ví dụ: 100000"
              />
              <FormFieldCustom
                name="maxPrice"
                label="Giá tối đa"
                placeholder="Ví dụ: 1000000"
              />
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" form="form-edit-price-segment">
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EditProductPriceSegmentModal;
