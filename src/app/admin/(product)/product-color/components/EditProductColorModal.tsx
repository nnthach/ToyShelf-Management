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

type EditProductColorModalProps = {
  colorId: string;
  isOpen: boolean;
  onClose: () => void;
};

function EditProductColorModal({
  colorId,
  isOpen,
  onClose,
}: EditProductColorModalProps) {
  const queryClient = useQueryClient();

  const { data: colorDetail, isLoading } = useQuery({
    queryKey: ["color", colorId],
    queryFn: () => getProductColorDetailAPI(colorId!),
    select: (res) => res.data,
    enabled: !!colorId,
  });

  const formSchema = z.object({
    name: z.string("").min(1, "Tên màu là bắt buộc"),
    hexCode: z.string("").min(1, "Mã màu là bắt buộc"),
    skuCode: z.string(""),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hexCode: "#000000",
      skuCode: "",
    },
  });

  useEffect(() => {
    if (colorDetail) {
      form.reset({
        name: colorDetail.name,
        hexCode: colorDetail.hexCode,
        skuCode: colorDetail.skuCode,
      });
    }
  }, [colorDetail, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updateProductColorAPI(colorId, data);

      queryClient.invalidateQueries({
        queryKey: ["colors"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["color", colorId],
      });

      form.reset();
      toast.success("Chỉnh sửa màu mới thành công");
      onClose();
    } catch (error) {
      console.log("create color err", error);
      toast.error("Chỉnh sửa màu mới thất bại");
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
              id="form-create-partner"
            >
              <div className="flex items-center justify-between gap-3">
                {/* TÊN MÀU */}
                <FormFieldCustom
                  name="name"
                  label="Tên màu"
                  placeholder="Ví dụ: Đỏ đô"
                />

                {/* HEX INPUT */}
                <FormFieldCustom
                  name="hexCode"
                  label="HEX Code"
                  placeholder="#000000"
                />
              </div>

              {/* COLOR PICKER */}
              <div className="w-full">
                <SketchPicker
                  color={form.watch("hexCode")}
                  onChange={(color) => {
                    const result = namer(color.hex);
                    const colorName = result.basic[0].name.toUpperCase();

                    form.setValue("name", colorName);
                    form.setValue("hexCode", color.hex);
                  }}
                />
              </div>
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" form="form-create-partner">
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EditProductColorModal;
