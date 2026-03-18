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
  Layers,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { createProducePriceSegmentAPI } from "@/src/services/product-segment.service";

function CreateProductPriceSegmentModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Tên cấp bậc giá là bắt buộc"),
    minPrice: z.number().min(0, "Hãy nhập giá tối thiếu"),
    // .min(1, "Giá tối thiểu là bắt buộc")
    // .refine((val) => !isNaN(Number(val)), "Giá tối thiểu phải là số")
    // .refine((val) => Number(val) >= 1, "Giá tối thiểu phải >= 1"),
    maxPrice: z.number().min(1, "Hãy nhập giá tối đa"),
    // .min(1, "Giá tối đa là bắt buộc")
    // .refine((val) => !isNaN(Number(val)), "Giá tối đa phải là số")
    // .refine((val) => Number(val) >= 1, "Giá tối đa phải >= 1"),
    code: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      minPrice: 0,
      maxPrice: 0,
      code: "",
    },
  });

  async function onSubmit(data: FormValues) {
    const payload = {
      ...data,
      code: data.name,
    };
    try {
      await createProducePriceSegmentAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["productPriceSegments"],
      });

      form.reset();
      toast.success("Thêm cấp bậc giá mới thành công");

      setOpen(false);
    } catch (error) {
      toast.error("Thêm cấp bậc giá mới thất bại");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Thêm cấp bậc giá sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Thêm cấp bậc giá sản phẩm
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
            <Send className="h-4 w-4" />
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductPriceSegmentModal;
