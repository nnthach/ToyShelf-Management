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

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      minPrice: "",
      maxPrice: "",
      code: "",
    },
  });

  async function onSubmit(data: FormValues) {
    const payload = {
      ...data,
      code: data.name,
    };
    console.log("create price segment data", payload);
    try {
      await createProducePriceSegmentAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["productPriceSegments"],
      });

      form.reset();
      toast.success("Thêm cấp bậc giá mới thành công");

      setOpen(false);
    } catch (error) {
      console.log("create price segment err", error);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm cấp bậc giá sản phẩm</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mb-2"
            id="form-create-price-segment"
          >
            <FormFieldCustom
              name="name"
              label="Tên cấp bậc giá"
              placeholder="Ví dụ: Cấp bậc 1"
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
          <Button type="submit" form="form-create-price-segment">
            Thêm mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductPriceSegmentModal;
