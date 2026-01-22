"use client";

import { Button } from "@/shared/styles/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/shared/styles/components/ui/card";
import { ScrollArea } from "@/shared/styles/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/styles/components/ui/sheet";
import { DollarSign, Home, Lock, RotateCcw, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/shared/utils/formatStatus";
import { memo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  deleteProductCategoryAPI,
  disableProductCategoryAPI,
  getProductCategoryDetailAPI,
  restoreProductCategoryAPI,
  updateProductCategoryAPI,
} from "@/shared/services/product-category.service";
import {
  ProductCategoryFormValues,
  productCateSchema,
} from "@/shared/schemas/product-category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/shared/styles/components/custom/FormFieldCustom";

type ViewDetailSheetProps = {
  productCateId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({
  productCateId,
  isOpen,
  onClose,
}: ViewDetailSheetProps) {
  const locale = useLocale();
  const t = useTranslations("admin.productCategory.viewProductCategory");
  const tFields = useTranslations("admin.productCategory.fields");
  const tStatus = useTranslations("status.isActive");
  const tCommon = useTranslations("common");
  const tButton = useTranslations("admin.button");
  const tButtonCommon = useTranslations("button");

  const queryClient = useQueryClient();

  const { data: productCateDetail, isLoading } = useQuery({
    queryKey: ["category", productCateId],
    queryFn: () => getProductCategoryDetailAPI(productCateId!),
    select: (res) => res.data,
    enabled: !!productCateId,
  });

  const form = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCateSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
    },
  });

  useEffect(() => {
    if (productCateDetail) {
      form.reset({
        name: productCateDetail.name,
        description: productCateDetail.description,
        code: productCateDetail.code,
      });
    }
  }, [productCateDetail, form]);

  async function onSubmit(data: ProductCategoryFormValues) {
    const payload = {
      ...data,
      code: data.name,
    };
    console.log("payload", payload);
    try {
      await updateProductCategoryAPI(payload, productCateId!);

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["category", productCateId],
      });

      form.reset();
      toast.success(
        locale === "vi"
          ? "Cập nhật danh mục thành công"
          : "Update product category successfully!",
      );
    } catch (error) {
      console.log("Update product category err", error);
      toast.error(
        locale === "vi"
          ? "Cập nhật danh mục thất bại"
          : "Failed to update product category",
      );
    }
  }

  if (!productCateId) return null;

  async function handleDisable() {
    try {
      await disableProductCategoryAPI(productCateId!);

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["category", productCateId],
      });

      form.reset();
      toast.success(
        locale === "vi"
          ? "Vô hiệu hóa danh mục thành công"
          : "Disable product category successfully!",
      );
    } catch (error) {
      console.log("Disable product category err", error);
      toast.error(
        locale === "vi"
          ? "Vô hiệu hóa danh mục thất bại"
          : "Failed to disable product category",
      );
    }
  }

  async function handleRestore() {
    try {
      await restoreProductCategoryAPI(productCateId!);

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["category", productCateId],
      });

      form.reset();
      toast.success(
        locale === "vi"
          ? "Khôi phục danh mục thành công"
          : "Restore product category successfully!",
      );
    } catch (error) {
      console.log("Restore product category err", error);
      toast.error(
        locale === "vi"
          ? "Khôi phục danh mục thất bại"
          : "Failed to restore product category",
      );
    }
  }

  async function handleDelete() {
    try {
      await deleteProductCategoryAPI(productCateId!);

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      form.reset();
      onClose();
      toast.success(
        locale === "vi"
          ? "Xóa danh mục thành công"
          : "Delete product category successfully!",
      );
    } catch (error) {
      console.log("Delete product category err", error);
      toast.error(
        locale === "vi"
          ? "Xóa danh mục thất bại"
          : "Failed to delete product category",
      );
    }
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>
            {t("header")}{" "}
            <span
              className={`text-sm pb-1 ${formatUserStatusColor(productCateDetail?.isActive)}`}
            >
              {tStatus(formatUserStatusText(productCateDetail?.isActive))}
            </span>
          </SheetTitle>
          <SheetDescription>
            {t("subHeader")} {productCateDetail?.name}
          </SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">
            {/* --- Top Stats Cards --- */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                        <Home className="text-white dark:text-black" />
                      </div>
                      <p className="text-primary text-lg">Total Orders</p>
                    </div>

                    <p className="text-xl font-bold text-primary">7 Orders</p>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Card 2 */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                        <DollarSign className="text-white dark:text-black" />
                      </div>
                      <p className="text-primary text-lg">Total Spending</p>
                    </div>

                    <p className="text-xl font-bold text-primary">
                      19,000,000 VND
                    </p>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* --- Recent order --- */}
            <div className="mt-4 border rounded-lg bg-background">
              <div className="border-b px-4 py-3 bg-background">
                <p className="font-medium">
                  Recent Orders <span className="text-gray-500">(9)</span>
                </p>
              </div>

              {/* Item */}
              <ScrollArea className="h-[380px] mt-3">
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 hover:bg-gray-200 dark:hover:bg-accent"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-md bg-gray-200" />

                      {/* Info */}
                      <div className="flex-1">
                        <p className="font-semibold">
                          £{(2300000 - i * 100000).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          📍 London, St John’s Hill 62
                        </p>
                      </div>

                      {/* Status */}
                      <span className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          {/*Right */}
          <div className="bg-background flex-1 border-t border-border flex flex-col">
            <div className="grid flex-1 auto-rows-min gap-6 px-4 mt-4">
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                  id="form-update-partner"
                >
                  <FormFieldCustom
                    name="name"
                    label={tFields("name.label")}
                    placeholder={tFields("name.label")}
                  />
                  <FormFieldCustom
                    name="description"
                    label={tFields("description.label")}
                    placeholder={`${tFields("description.label")}`}
                  />
                </form>
              </FormProvider>
            </div>

            <div className="border-t border-border px-4 py-3 mt-auto">
              <div className="flex items-center justify-between gap-2">
                {productCateDetail?.isActive ? (
                  <Button
                    variant="outline"
                    title={tButtonCommon("disable")}
                    onClick={() => handleDisable()}
                  >
                    <Lock color="red" />
                  </Button>
                ) : (
                  <div>
                    <Button
                      variant="outline"
                      title={tButtonCommon("delete")}
                      onClick={() => handleDelete()}
                    >
                      <Trash2 color="red" />
                    </Button>

                    <Button
                      variant="outline"
                      title={tButtonCommon("restore")}
                      onClick={() => handleRestore()}
                    >
                      <RotateCcw color="aqua" />
                    </Button>
                  </div>
                )}
                <Button
                  type="submit"
                  form="form-update-warehouse"
                  className="flex-1"
                >
                  {tButton("saveChange")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(ViewDetailSheet);
