"use client";
import {
  WarehouseFormValues,
  warehouseSchema,
} from "@/shared/schemas/warehouse.schema";
import { createWarehouseAPI } from "@/shared/services/warehouse.service";
import { FormFieldCustom } from "@/shared/styles/components/custom/FormFieldCustom";
import { Button } from "@/shared/styles/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, memo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatToSlug } from "@/shared/utils/format";
import {
  ProductCategoryFormValues,
  productCateSchema,
} from "@/shared/schemas/product-category.schema";
import { createProductCategoryAPI } from "@/shared/services/product-category.service";

function CreateCategoryModal() {
  const locale = useLocale();
  const tButton = useTranslations("admin.button");
  const tStatus = useTranslations("status.partner");
  const tCommon = useTranslations("common");
  const tFields = useTranslations("admin.productCategory.fields");
  const tCreateProductCate = useTranslations(
    "admin.productCategory.createProductCategory",
  );
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
      toast.success(
        locale === "vi"
          ? "Tạo danh mục thành công"
          : "Create product category successfully!",
      );
      setOpen(false);
    } catch (error) {
      console.log("create product category err", error);
      toast.error(
        locale === "vi"
          ? "Tạo danh mục thất bại"
          : "Failed to create product category",
      );
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
            <Plus /> {tCreateProductCate("header")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tCreateProductCate("header")}</DialogTitle>
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
                label={tFields("name.label")}
                placeholder={tFields("name.label")}
              />

              <FormFieldCustom
                name="description"
                label={tFields("description.label")}
                placeholder={tFields("description.label")}
              />
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="form-create-product-category">
              {tButton("publish")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default memo(CreateCategoryModal);
