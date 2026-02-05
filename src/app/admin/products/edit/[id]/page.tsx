"use client";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import {
  ProductBrandOption,
  ProductMaterialOption,
} from "@/src/constants/product-option";
import { ProductFormValues, productSchema } from "@/src/schemas/product.schema";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmPopup from "../../create/ConfirmPopup";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProductDetailAPI, updateProductAPI } from "@/src/services/product.service";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";
import { ProductCategory } from "@/src/types";
import { SelectOption } from "@/src/types/SubType";
import { Button } from "@/src/styles/components/ui/button";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import ModelThreeDPreview from "@/src/styles/components/custom/ModelThreeDPreview";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const threeDInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [threeDPreview, setThreeDPreview] = useState<string | null>(null);
  const [threeDFile, setThreeDFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<ProductFormValues | null>(
    null,
  );
  const [openVerifyCreateForm, setOpenVerifyCreateForm] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      productCategoryId: "",
      price: 0,
      brand: "",
      material: "",
      originCountry: "",
      ageRange: "",
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
        price: productDetail.price,
        brand: productDetail.brand,
        material: productDetail.material,
        originCountry: productDetail.originCountry,
        ageRange: productDetail.ageRange,
      });
    }
  }, [productDetail, form]);

  const { data: categoryList = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllProductCategoryAPI({}),
    select: (res) => res.data as ProductCategory[],
  });

  const handleRemoveThreeD = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThreeDFile(null);
    setThreeDPreview(null);

    if (threeDInputRef.current) {
      threeDInputRef.current.value = "";
    }
  };

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImageFiles((prev) => {
      const merged = [...prev, ...files].slice(0, 4); // max 4
      return merged;
    });

    // reset input để chọn lại cùng file
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  function onSubmit(data: ProductFormValues) {
    setPreviewData(data);
    setOpenVerifyCreateForm(true);
  }

  const handleConfirmUpdate = useCallback(async () => {
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
      await updateProductAPI(previewData, id);

      toast.success("Cập nhật sản phẩm thành công");

      form.reset();
      setPreviewData(null);
      setImageFiles([]);

      setOpenVerifyCreateForm(false);
      router.back();
    } catch (error) {
      toast.error("Cập nhật sản phẩm thất bại");
    } finally {
      setIsLoading(false);
    }
  }, [previewData, imageFiles, form]);

  const categoryOptions: SelectOption[] = categoryList.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  if (loadingFetchProduct) {
    <LoadingPageComponent />;
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
          form="form-rhf-demo"
          className="btn-primary-gradient"
        >
          Lưu thay đổi
          <Check />
        </Button>
      </div>

      {/*Content */}
      <div className="grid grid-cols-2 gap-3 w-full min-h-[80vh] my-4 rounded-xl">
        {/*Field*/}
        <div className="bg-background rounded-lg p-4">
          <div className="mb-4">
            <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
              Thông tin sản phẩm
            </h1>
            <p className="text-gray-500 text-sm">Vui lòng điền đầy đủ thông tin sản phẩm</p>
          </div>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-rhf-demo"
            >
              <div className="grid grid-cols-2 gap-3">
                <FormFieldCustom
                  name="name"
                  label="Tên sản phẩm"
                  placeholder="Tên sản phẩm"
                />
                <FormFieldCustom
                  name="productCategoryId"
                  label="Danh mục"
                  placeholder="Chọn danh mục"
                  type="select"
                  selectData={categoryOptions}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormFieldCustom
                  name="price"
                  label="Giá"
                  placeholder="Giá"
                  type="number"
                />
                <FormFieldCustom
                  name="size"
                  label="Kích thước"
                  placeholder="Chọn kích thước"
                  type="select"
                  selectData={categoryOptions}
                />
                <FormFieldCustom
                  name="weight"
                  label="Cân nặng"
                  placeholder="Chọn cân nặng"
                  labelNote="(gram)"
                  type="number"
                />
                <FormFieldCustom
                  name="material"
                  label="Chất liệu"
                  placeholder="Chọn chất liệu"
                  type="select"
                  selectData={ProductMaterialOption}
                />
                <FormFieldCustom
                  name="brand"
                  label="Thương hiệu"
                  placeholder="Chọn thương hiệu"
                  type="select"
                  selectData={ProductBrandOption}
                />
                <FormFieldCustom
                  name="originCountry"
                  label="Quốc gia sản xuất"
                  placeholder="Quốc gia sản xuất"
                />
                <FormFieldCustom
                  name="ageRange"
                  label="Độ tuổi"
                  placeholder="Độ tuổi"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormFieldCustom
                  name="Length"
                  label="Chiều dài"
                  placeholder="Chiều dài"
                  labelNote="(cm)"
                  type="number"
                />
                <FormFieldCustom
                  name="width"
                  label="Chiều rộng"
                  placeholder="Chiều rộng"
                  labelNote="(cm)"
                  type="number"
                />
                <FormFieldCustom
                  name="height"
                  label="Chiều cao"
                  labelNote="(cm)"
                  placeholder="Chiều cao"
                  type="number"
                />
              </div>
              <FormFieldCustom
                name="description"
                label="Mô tả"
                placeholder="Mô tả"
                type="textarea"
              />
            </form>
          </FormProvider>
        </div>

        {/*Image 3Ds */}
        <div className="bg-background rounded-lg p-4">
          <div className="mb-4">
            <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
              Hình ảnh và mô hình 3D
            </h1>
            <p className="text-gray-500 text-sm">Tải lên hình ảnh sản phẩm và file mô hình 3D</p>
          </div>
          <div className="flex flex-col gap-3">
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

                  setThreeDFile(file);

                  const url = URL.createObjectURL(file);
                  setThreeDPreview(url);
                }}
              />

              <div
                onClick={() =>
                  !threeDPreview && threeDInputRef.current?.click()
                }
                className="relative
    h-[260px]
    border-2 border-dashed border-gray-300
    rounded-xl
    flex items-center justify-center
    hover:border-blue-500
    transition
    cursor-pointer
    bg-muted
  "
              >
                {threeDPreview ? (
                  <div className="h-[260px] rounded-xl overflow-hidden">
                    <ModelThreeDPreview url={threeDPreview} />
                    <Button
                      className="absolute top-2 right-2 hover:bg-gray-50 w-8 h-8 rounded-md"
                      onClick={(e) => {
                        handleRemoveThreeD(e);
                      }}
                      variant={"outline"}
                    >
                      <Trash2 color="red" size={20} />
                    </Button>
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
                Hình ảnh sản phẩm (tối đa 4 ảnh)
              </span>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleSelectImages}
              />

              <div className="grid grid-cols-4 gap-3">
                {/* Preview images */}
                {imageFiles.map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);

                  return (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group border"
                    >
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 w-7 h-7 rounded-md
              bg-white/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2
                          size={14}
                          className="text-red-500 group-hover:text-white"
                        />
                      </button>
                    </div>
                  );
                })}

                {/* Upload box */}
                {imageFiles.length < 4 && (
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer"
                  >
                    <span className="text-2xl">+</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openVerifyCreateForm && (
        <ConfirmPopup
          isLoading={isLoading}
          openVerifyCreateForm={openVerifyCreateForm}
          setOpenVerifyCreateForm={setOpenVerifyCreateForm}
          previewData={previewData}
          threeDPreview={threeDPreview}
          imagePreview={imageFiles}
          handleConfirmCreate={handleConfirmUpdate}
        />
      )}
    </>
  );
}
