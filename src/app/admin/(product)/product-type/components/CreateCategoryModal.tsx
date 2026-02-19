"use client";

import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
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
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { memo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ProductCategoryFormValues,
  productCateSchema,
} from "@/src/schemas/product-category.schema";
import { formatToSlug } from "@/src/utils/format";
import { createProductCategoryAPI } from "@/src/services/product-category.service";

function CreateCategoryModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const form = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCateSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
    },
  });

  async function onSubmit(data: ProductCategoryFormValues) {
    const payload = {
      ...data,
      code: formatToSlug(data.name),
    };

    console.log("payload", payload);

    try {
      await createProductCategoryAPI(payload);
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      form.reset();
      toast.success("Tạo danh mục thành công");
      setOpen(false);
    } catch (error) {
      console.log("create product category err", error);
      toast.error("Tạo danh mục thất bại");
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
      <form>
        <DialogTrigger asChild>
          <Button className="btn-primary-gradient">
            <Plus />
            Thêm danh mục mới
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm danh mục mới</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-create-product-category"
            >
              <FormFieldCustom
                name="name"
                label="Tên danh mục"
                placeholder="Nhập tên danh mục"
              />

              <FormFieldCustom
                name="description"
                label="Mô tả"
                placeholder="Nhập mô tả danh mục"
              />
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" form="form-create-product-category">
              Tạo mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default memo(CreateCategoryModal);
