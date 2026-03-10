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
import { Edit, FileText, Plus, Sparkles, Tag } from "lucide-react";
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
      onClose();
    } catch (error) {
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ với hệ thống */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Chỉnh sửa danh mục
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-blue-500" />
            Phân loại sản phẩm giúp khách hàng dễ dàng tìm kiếm hơn.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-product-category"
            >
              <FormFieldCustom
                name="name"
                label="Tên danh mục"
                placeholder="Ví dụ: Đồ chơi gỗ, Quần áo sơ sinh..."
                icon={<Tag size={18} />} // Icon nhãn dán cho danh mục
              />

              <FormFieldCustom
                name="description"
                label="Mô tả danh mục"
                placeholder="Nhập vài dòng mô tả ngắn gọn về nhóm sản phẩm này..."
                type="textarea"
                icon={<FileText size={18} />} // Icon văn bản cho mô tả
                className="min-h-[100px]"
              />
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
            form="form-create-product-category"
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

export default memo(EditCategoryModal);
