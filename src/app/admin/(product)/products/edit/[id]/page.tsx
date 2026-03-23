"use client";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import {
  ProductUpdateFormValues,
  productUpdateSchema,
} from "@/src/schemas/product.schema";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getProductDetailAPI,
  updateProductAPI,
} from "@/src/services/product.service";
import { Color, ProductColorItem, ProductPriceSegment } from "@/src/types";
import { SelectOption } from "@/src/types/SubType";
import { Button } from "@/src/styles/components/ui/button";
import { getAllProductColorAPI } from "@/src/services/product-color.service";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";
import EditProductInfoLeft from "../components/EditProductInfoLeft";
import EditProductMediaRight from "../components/EditProductMediaRight";
import ConfirmPopup from "../../create/ConfirmPopup";
import { uploadFileToCloudinary } from "@/src/config/cloundinary";
import { formatColorNameToVN } from "@/src/utils/format";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] =
    useState<ProductUpdateFormValues | null>(null);
  const [openVerifyCreateForm, setOpenVerifyCreateForm] = useState(false);

  const form = useForm<ProductUpdateFormValues>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      productCategoryId: "",
      name: "",
      basePrice: 0,
      description: "",
      brand: "",
      material: "",
      originCountry: "",
      isConsignment: false,
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

  const { data: productDetail, isLoading: loadingFetchProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductDetailAPI(id!),
    select: (res) => res.data,
    enabled: !!id,
  });

  useEffect(() => {
    if (productDetail) {
      form.reset({
        name: productDetail.name,
        description: productDetail.description,
        productCategoryId: productDetail.productCategoryId,
        basePrice: productDetail.basePrice,
        brand: productDetail.brand,
        material: productDetail.material,
        originCountry: productDetail.originCountry,
        ageRange: productDetail.ageRange,
        isConsignment: productDetail.isConsignment,
        weight: productDetail.weight,
        height: productDetail.height,
        length: productDetail.length,
        width: productDetail.width,
        colors: productDetail.colors.map((color: ProductColorItem) => ({
          colorId: color.colorId,
          priceSegmentId: color.priceSegmentId,
          price: color.price,
          model3DUrl: color.model3DUrl,
          imageUrl: color.imageUrl,
        })),
      });
    }
  }, [productDetail, form]);

  // product color
  const { data: colorList = [] } = useQuery({
    queryKey: ["colors"],
    queryFn: () => getAllProductColorAPI({}),
    select: (res) => res.data as Color[],
  });

  const colorOptions = colorList.map((c) => ({
    value: c.id,
    label: formatColorNameToVN(
      c.name.charAt(0).toUpperCase() + c.name.slice(1).toLowerCase(),
    ),
    hexCode: c.hexCode,
  }));

  // product price segment
  const { data: productPriceSegmentList = [], refetch } = useQuery({
    queryKey: ["productPriceSegments"],
    queryFn: () => getAllProducePriceSegmentAPI({}),
    select: (res) => res.data as ProductPriceSegment[],
  });

  const priceSegmentOptions: SelectOption[] = productPriceSegmentList.map(
    (c) => ({
      value: c.id,
      label: c.name,
    }),
  );

  function onSubmit(data: ProductUpdateFormValues) {
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
    console.log("payload", payload);
    setPreviewData(payload);
    setOpenVerifyCreateForm(true);
  }

  const handleConfirmUpdate = useCallback(async () => {
    if (!previewData) return;

    setIsLoading(true);
    try {
      const uploadedColors = await Promise.all(
        previewData.colors.map(async (color) => {
          let imageUrl = color.imageUrl;
          let model3DUrl = color.model3DUrl;

          // Nếu user chọn file mới → upload
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

      await updateProductAPI(finalPayload, id);

      toast.success("Cập nhật sản phẩm thành công");

      form.reset();
      setPreviewData(null);

      setOpenVerifyCreateForm(false);
      router.back();
    } catch (error) {
      toast.error("Cập nhật sản phẩm thất bại");
    } finally {
      setIsLoading(false);
    }
  }, [previewData, form, id]);

  if (loadingFetchProduct) {
    return <LoadingPageComponent />;
  }

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
            Cập nhật sản phẩm
          </h1>
        </div>
        {/*Right */}
        <Button
          type="submit"
          form="form-update-product"
          className="btn-primary-gradient"
        >
          Lưu thay đổi
          <Check />
        </Button>
      </div>

      {/*Content */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("FORM ERROR:", errors),
          )}
          id="form-update-product"
        >
          <div className="grid grid-cols-2 gap-3 w-full h-[80vh] my-4 rounded-xl overflow-y-auto">
            {/*Field*/}
            <EditProductInfoLeft />

            {/*Image 3Ds */}
            <EditProductMediaRight
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
          handleConfirmCreate={handleConfirmUpdate}
          type={"Update"}
        />
      )}
    </>
  );
}
