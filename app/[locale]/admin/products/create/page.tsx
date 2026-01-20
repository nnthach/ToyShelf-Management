"use client";
import { uploadFileToCloudinary } from "@/shared/config/cloundinary";
import { ProductCategoryData } from "@/shared/constants/fakeData";
import {
  ProductFormValues,
  productSchema,
} from "@/shared/schemas/product.schema";
import { FormFieldCustom } from "@/shared/styles/components/custom/FormFieldCustom";
import ModelThreeDPreview from "@/shared/styles/components/custom/ModelThreeDPreview";
import { Button } from "@/shared/styles/components/ui/button";
import { SelectOption } from "@/shared/types/SubType";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmPopup from "./ConfirmPopup";
import LoadingPageComponent from "@/shared/components/LoadingPageComponent";

export default function CreateProductPage() {
  const router = useRouter();
  const t = useTranslations("admin.products.createProduct");
  const tButton = useTranslations("admin.button");
  const tFields = useTranslations("admin.products.fields");
  const locale = useLocale();

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
      weight: 0,
      width: 0,
      length: 0,
      height: 0,
      size: "",
      unit: "",
      color: [],
    },
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
      const merged = [...prev, ...files].slice(0, 4); // max 6
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
    console.log("alo");
    setPreviewData(data);
    setOpenVerifyCreateForm(true);
  }

  const handleConfirmCreate = useCallback(async () => {
    if (!previewData) return;

    setIsLoading(true);
    try {
      const imagesUrl = imageFiles
        ? await uploadFileToCloudinary(imageFiles, "product")
        : null;

      const threeDUrl = threeDFile
        ? await uploadFileToCloudinary(threeDFile, "product")
        : null;

      console.log("threeDUrl products url", threeDUrl);

      toast.success(
        locale === "vi"
          ? "Thêm sản phẩm thành công"
          : "Product created successfully",
      );

      form.reset();
      setPreviewData(null);
      setImageFiles([]);

      setOpenVerifyCreateForm(false);
    } catch (error) {
      toast.error(
        locale === "vi" ? "Thêm sản phẩm thất bại" : "Failed to create product",
      );
    } finally {
      setIsLoading(false);
    }
  }, [previewData, imageFiles, form]);

  const categoryOptions: SelectOption[] = ProductCategoryData.map((c) => ({
    value: c.id,
    label: c.name,
  }));

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
            {t("header")}
          </h1>
        </div>
        {/*Right */}
        <Button
          type="submit"
          form="form-rhf-demo"
          className="btn-primary-gradient"
        >
          {tButton("confirm")}
          <Check />
        </Button>
      </div>

      {/*Content */}
      <div className="grid grid-cols-2 gap-3 w-full h-[80vh] my-4 rounded-xl overflow-y-auto">
        {/*Field*/}
        <div className="bg-background rounded-lg p-4 border">
          <div className="mb-4">
            <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
              {t("leftHeader")}
            </h1>
            <p className="text-gray-500 text-sm">{t("leftSubHeader")}</p>
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
                  label={tFields("productName")}
                  placeholder={tFields("productName")}
                />
                <FormFieldCustom
                  name="productCategoryId"
                  label={tFields("productCategory")}
                  placeholder="Select a category"
                  type="select"
                  selectData={categoryOptions}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormFieldCustom
                  name="price"
                  label={tFields("price")}
                  placeholder={tFields("price")}
                />
                <FormFieldCustom
                  name="size"
                  label={tFields("size")}
                  placeholder="Select a size"
                  type="select"
                  selectData={categoryOptions}
                />
                <FormFieldCustom
                  name="weight"
                  label={tFields("weight")}
                  labelNote="(gram)"
                  placeholder={tFields("weight")}
                  type="number"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormFieldCustom
                  name="Length"
                  label={tFields("length")}
                  labelNote="(cm)"
                  placeholder={tFields("weight")}
                  type="number"
                />
                <FormFieldCustom
                  name="width"
                  label={tFields("width")}
                  labelNote="(cm)"
                  placeholder={tFields("width")}
                  type="number"
                />
                <FormFieldCustom
                  name="height"
                  label={tFields("height")}
                  labelNote="(cm)"
                  placeholder={tFields("height")}
                  type="number"
                />
              </div>
              <FormFieldCustom
                name="description"
                label={tFields("description")}
                placeholder={tFields("description")}
                type="textarea"
              />
            </form>
          </FormProvider>
        </div>

        {/*Image 3Ds */}
        <div className="bg-background rounded-lg p-4 border">
          <div className="mb-4">
            <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
              {t("rightHeader")}
            </h1>
            <p className="text-gray-500 text-sm">{t("rightSubHeader")}</p>
          </div>
          <div className="flex flex-col gap-3">
            {/* 3D Preview */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">
                {tFields("product3DFile")}
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
                    <span className="text-sm">{t("add3dFile")}</span>
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
                {tFields("productImages")} ({t("maxLengthImages")})
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
          handleConfirmCreate={handleConfirmCreate}
        />
      )}
    </>
  );
}
