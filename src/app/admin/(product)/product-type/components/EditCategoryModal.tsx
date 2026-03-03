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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ProductCategoryFormValues,
  productCateSchema,
} from "@/src/schemas/product-category.schema";
import {
  createProductCategoryAPI,
  getAllProductCategoryAPI,
  getProductCategoryDetailAPI,
  updateProductCategoryAPI,
} from "@/src/services/product-category.service";
import { SelectOption } from "@/src/types/SubType";
import { ProductCategory } from "@/src/types";

type EditProductCategoryModalProps = {
  categoryId: string;
  isOpen: boolean;
  onClose: () => void;
};
function EditCategoryModal({
  categoryId,
  isOpen,
  onClose,
}: EditProductCategoryModalProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data: categoryDetail, isLoading } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getProductCategoryDetailAPI(categoryId!),
    select: (res) => res.data,
    enabled: !!categoryId,
  });

  const form = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (categoryDetail) {
      form.reset({
        name: categoryDetail.name,
        description: categoryDetail.description,
      });
    }
  }, [categoryDetail, form]);

  async function onSubmit(data: ProductCategoryFormValues) {
    try {
      await updateProductCategoryAPI(categoryId, data);
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["category", categoryId],
      });

      form.reset();
      toast.success("Cập nhật danh mục thành công");
      setOpen(false);
    } catch (error) {
      console.log("update product category err", error);
      toast.error("Cập nhật danh mục thất bại");
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
            <DialogTitle>Cập nhật danh mục</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-update-product-category"
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
            <Button type="submit" form="form-update-product-category">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default memo(EditCategoryModal);
