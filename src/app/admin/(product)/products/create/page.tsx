"use client";

import { ProductFormValues, productSchema } from "@/src/schemas/product.schema";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import ModelThreeDPreview from "@/src/styles/components/custom/ModelThreeDPreview";
import { Button } from "@/src/styles/components/ui/button";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmPopup from "./ConfirmPopup";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { useQuery } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProductColor, ProductPriceSegment } from "@/src/types";
import { createProductAPI } from "@/src/services/product.service";
import { SelectOption } from "@/src/types/SubType";
import { getAllProductColorAPI } from "@/src/services/product-color.service";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";
import ProductInfoLeft from "./components/ProductInfoLeft";

export default function CreateProductPage() {
  const router = useRouter();

  const threeDInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [threeDFiles, setThreeDFiles] = useState<Record<number, File | null>>(
    {},
  );
  const [threeDPreviews, setThreeDPreviews] = useState<
    Record<number, string | null>
  >({});

  const [imageFiles, setImageFiles] = useState<Record<number, File[]>>({});

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "colors",
  });

  // product color
  const { data: colorList = [] } = useQuery({
    queryKey: ["colors"],
    queryFn: () => getAllProductColorAPI({}),
    select: (res) => res.data as ProductColor[],
  });

  const colorOptions: SelectOption[] = colorList.map((c) => ({
    value: c.id,
    label: c.name,
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
      label: c.name,
    }),
  );

  const handleRemoveThreeD = (index: number) => {
    setThreeDFiles((prev) => ({ ...prev, [index]: null }));
    setThreeDPreviews((prev) => ({ ...prev, [index]: null }));
  };

  function onSubmit(data: ProductFormValues) {
    const payload = {
      ...data,
      colors: data.colors.map((i) => ({
        ...i,
        price: Number(i.price),
      })),
    };
    setPreviewData(payload);
    setOpenVerifyCreateForm(true);
  }

  const handleConfirmCreate = useCallback(async () => {
    if (!previewData) return;

    console.log("preview data", previewData);

    setIsLoading(true);
    try {
      // const imagesUrl = imageFiles
      //   ? await uploadFileToCloudinary(imageFiles, "product")
      //   : null;

      // const threeDUrl = threeDFile
      //   ? await uploadFileToCloudinary(threeDFile, "product")
      //   : null;

      // console.log("threeDUrl products url", threeDUrl);
      await createProductAPI(previewData);

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
          form="form-rhf-demo"
          className="btn-primary-gradient"
        >
          Xác nhận
          <Check />
        </Button>
      </div>

      {/*Content */}
      <div className="grid grid-cols-2 gap-3 w-full h-[80vh] my-4 rounded-xl overflow-y-auto">
        {/*Field*/}
        <ProductInfoLeft form={form} />

        {/*Image 3Ds */}
        <div className="bg-background rounded-lg p-4 border h-full overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
              Màu sắc, hình ảnh và mô hình 3D
            </h1>
            <p className="text-gray-500 text-sm">
              Lựa chọn màu sắc, tải lên hình ảnh sản phẩm và file mô hình 3D
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border p-3 rounded-md items-center"
              >
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <FormProvider {...form}>
                      <form className="space-y-3" id="form-rhf-demo">
                        <div className="grid grid-cols-1 gap-3">
                          <FormFieldCustom
                            name={`colors.${index}.colorId`}
                            label="Màu sắc"
                            placeholder="Chọn màu sắc"
                            type="select"
                            selectData={colorOptions}
                          />
                          <FormFieldCustom
                            name={`colors.${index}.price`}
                            label="Giá sản phẩm"
                            placeholder="Giá sản phẩm"
                            type="number"
                          />

                          <FormFieldCustom
                            name={`colors.${index}.priceSegmentId`}
                            label="Phân khúc giá"
                            placeholder="Chọn phân khúc giá"
                            type="select"
                            selectData={priceSegmentOptions}
                          />
                        </div>
                      </form>
                    </FormProvider>
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      {/* 3D Preview */}
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">
                          File mô hình 3D
                        </span>

                        <input
                          ref={threeDInputRef}
                          type="file"
                          accept=".glb,.gltf"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const url = URL.createObjectURL(file);

                            setThreeDFiles((prev) => ({
                              ...prev,
                              [index]: file,
                            }));

                            setThreeDPreviews((prev) => ({
                              ...prev,
                              [index]: url,
                            }));
                          }}
                        />

                        <div
                          onClick={() =>
                            !threeDPreviews[index] &&
                            threeDInputRef.current?.click()
                          }
                          className="relative
        h-[200px] border-2 border-dashed border-gray-300 rounded-xl
        flex items-center justify-center hover:border-blue-500 transition cursor-pointer bg-muted"
                        >
                          {threeDPreviews[index] ? (
                            <div className="h-[200px] rounded-xl overflow-hidden w-full">
                              <ModelThreeDPreview
                                key={threeDPreviews[index]}
                                url={threeDPreviews[index] ?? ""}
                              />

                              {!threeDPreviews[index] && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                  Thêm file 3D
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-gray-500">
                              <span className="text-sm">Thêm file 3D</span>
                              <span className="text-xs text-gray-400 mt-1">
                                (.glb, .gltf)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">
                          Hình ảnh sản phẩm
                        </span>

                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);

                            setImageFiles((prev) => ({
                              ...prev,
                              [index]: [...(prev[index] || []), ...files].slice(
                                0,
                                4,
                              ),
                            }));
                          }}
                        />

                        <div className="grid grid-cols-4 gap-3">
                          {/* Preview images */}
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden group border h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-500 transition cursor-pointer bg-muted"
                          >
                            {(imageFiles[index] || []).map((file, imgIndex) => {
                              const previewUrl = URL.createObjectURL(file);

                              return <img key={imgIndex} src={previewUrl} />;
                            })}

                            <button
                              type="button"
                              className="absolute top-1 right-1 w-7 h-7 rounded-md
                  bg-white/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2
                                size={14}
                                className="text-red-500 group-hover:text-white"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* {openVerifyCreateForm && (
        <ConfirmPopup
          isLoading={isLoading}
          openVerifyCreateForm={openVerifyCreateForm}
          setOpenVerifyCreateForm={setOpenVerifyCreateForm}
          previewData={previewData}
          threeDPreview={threeDPreview}
          imagePreview={imageFiles}
          handleConfirmCreate={handleConfirmCreate}
        />
      )} */}
    </>
  );
}
