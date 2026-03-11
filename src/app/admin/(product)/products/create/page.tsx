"use client";

import { ProductFormValues, productSchema } from "@/src/schemas/product.schema";
import { Button } from "@/src/styles/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmPopup from "./ConfirmPopup";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductAPI } from "@/src/services/product.service";
import CreateProductInfoLeft from "./components/CreateProductInfoLeft";
import CreateProductMediaRight from "./components/CreateProductMediaRight";
import { getAllProductColorAPI } from "@/src/services/product-color.service";
import { Color, ProductPriceSegment } from "@/src/types";
import { SelectOption } from "@/src/types/SubType";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";
import { useQuery } from "@tanstack/react-query";
import { uploadFileToCloudinary } from "@/src/config/cloundinary";

export default function CreateProductPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<ProductFormValues | null>(
    null,
  );
  const [openVerifyCreateForm, setOpenVerifyCreateForm] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productCategoryId: "",
      name: "",
      price: 0,
      description: "",
      brand: "",
      material: "",
      originCountry: "",
      ageRange: "",
      colors: [
        {
          name: "",
          colorId: "",
          priceSegmentId: "",
          price: 0,
          model3DUrl: "",
          imageUrl: "",
        },
      ],
    },
  });

  // product color
  const { data: colorList = [] } = useQuery({
    queryKey: ["colors"],
    queryFn: () => getAllProductColorAPI({}),
    select: (res) => res.data as Color[],
  });

  const colorOptions = colorList.map((c) => ({
    value: c.id,
    label: c.name.charAt(0).toUpperCase() + c.name.slice(1).toLowerCase(),
    hexCode: c.hexCode,
  }));

  // product price segment
  const { data: productPriceSegmentList = [], isLoading: loading } = useQuery({
    queryKey: ["productPriceSegments"],
    queryFn: () => getAllProducePriceSegmentAPI({}),
    select: (res) => res.data as ProductPriceSegment[],
  });

  const priceSegmentOptions: SelectOption[] = productPriceSegmentList.map(
    (c) => ({
      value: c.id,
      label: `${c.name} (${c.minPrice.toLocaleString()} - ${c.maxPrice.toLocaleString()} VND)`,
    }),
  );

  function onSubmit(data: ProductFormValues) {
    const payload = {
      ...data,
      colors: data.colors.map((i) => {
        const selectedColor = colorOptions.find((c) => c.value === i.colorId);

        const selectedSegment = priceSegmentOptions.find(
          (p) => p.value === i.priceSegmentId,
        );

        const label = selectedColor?.label ?? "";
        const formattedName =
          label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

        return {
          ...i,
          price: Number(i.price),
          colorName: formattedName,
          colorHex: selectedColor?.hexCode ?? "#ccc",
          priceSegmentName: selectedSegment?.label ?? "",
        };
      }),
    };

    setPreviewData(payload);
    setOpenVerifyCreateForm(true);
  }

  const handleConfirmCreate = useCallback(async () => {
    if (!previewData) return;

    setIsLoading(true);
    try {
      // upload files to cloudinary and get url
      const uploadedColors = await Promise.all(
        previewData.colors.map(async (color) => {
          let imageUrl = color.imageUrl;
          let model3DUrl = color.model3DUrl;

          if (color.imageFile instanceof File) {
            imageUrl = await uploadFileToCloudinary(color.imageFile, "product");
          }

          if (color.model3DFile instanceof File) {
            model3DUrl = await uploadFileToCloudinary(
              color.model3DFile,
              "product",
            );
          }

          return {
            ...color,
            imageUrl,
            model3DUrl,
          };
        }),
      );

      const finalPayload = {
        ...previewData,
        colors: uploadedColors,
      };

      await createProductAPI(finalPayload);

      toast.success("Thêm sản phẩm thành công");

      form.reset();
      setPreviewData(null);

      setOpenVerifyCreateForm(false);
    } catch (error) {
      toast.error("Thêm sản phẩm thất bại");
    } finally {
      setIsLoading(false);
    }
  }, [previewData, form]);

  return (
    <>
      {isLoading && <LoadingPageComponent />}

      {/*Header */}
      <div className="flex items-center justify-between">
        {/*Left */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => router.back()}
            className="w-8 h-8"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-bold dark:text-foreground">
            Thêm sản phẩm
          </h1>
        </div>
        {/*Right */}
        <Button
          type="submit"
          className="btn-primary-gradient"
          form="form-create-product"
        >
          <Check />
          Xác nhận
        </Button>
      </div>

      {/*Content */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="form-create-product">
          <div className="grid grid-cols-2 gap-3 w-full h-[80vh] my-4 rounded-xl overflow-y-auto">
            {/*Field*/}
            <CreateProductInfoLeft />

            {/*Image 3Ds */}
            <CreateProductMediaRight
              form={form}
              colorOptions={colorOptions}
              priceSegmentOptions={priceSegmentOptions}
            />
          </div>
        </form>
      </FormProvider>

      {openVerifyCreateForm && (
        <ConfirmPopup
          isLoading={isLoading}
          openVerifyCreateForm={openVerifyCreateForm}
          setOpenVerifyCreateForm={setOpenVerifyCreateForm}
          previewData={previewData}
          handleConfirmCreate={handleConfirmCreate}
          type="Create"
        />
      )}
    </>
  );
}
