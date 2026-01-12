"use client";

import { FormFieldCustom } from "@/shared/styles/components/custom/FormFieldCustom";
import { Button } from "@/shared/styles/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import MapCreate from "./MapCreate";
import LoadingPageComponent from "@/shared/components/LoadingPageComponent";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "@/shared/config/cloundinary";
import { OPEN_DAY_OPTION } from "@/shared/constants/openday-option";
import { OWNER_OPTION } from "@/shared/constants/fakeData";
import ConfirmPopup from "./ConfirmPopup";
import { StoreFormValues, storeSchema } from "@/shared/schemas/store.schema";
import { useLocale } from "next-intl";

export default function CreateProductPage() {
  const router = useRouter();

  const t = useTranslations("admin.stores.createStore");
  const tButton = useTranslations("admin.button");
  const tFields = useTranslations("admin.stores.fields");
  const tRarelyUse = useTranslations("selectImage");
  const locale = useLocale();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [openVerifyCreateForm, setOpenVerifyCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      owner: "",
      address: "",
      openDay: "",
      openTime: "",
      closeTime: "",
      latitude: 0,
      longitude: 0,
    },
  });
  const [previewData, setPreviewData] = useState<StoreFormValues | null>(null);

  const address = form.watch("address");

  // map box
  useEffect(() => {
    if (!address) {
      setIsGeocoding(false);
      return;
    }

    setIsGeocoding(true);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
        );

        const data = await res.json();
        if (!data.features?.length) return;

        const [lng, lat] = data.features[0].center;

        form.setValue("latitude", lat);
        form.setValue("longitude", lng);

        window.dispatchEvent(
          new CustomEvent("map:flyTo", {
            detail: { lat, lng },
          })
        );
      } catch (err) {
        console.error("Geocoding error:", err);
      } finally {
        setIsGeocoding(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      setIsGeocoding(false);
    };
  }, [address]);

  // support loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isLoading]);

  /*IMAGE */
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warn(`${tRarelyUse("selectImage")}`);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // reset input để chọn lại cùng file
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  /*END IMAGE */

  function onSubmit(data: StoreFormValues) {
    setPreviewData(data);
    setOpenVerifyCreateForm(true);
  }

  const handleConfirmCreate = useCallback(async () => {
    if (!previewData) return;

    setIsLoading(true);
    try {
      const imageUrl = imageFile
        ? await uploadFileToCloudinary(imageFile, "store")
        : null;

      toast.success(
        locale === "vi"
          ? "Tạo cửa hàng thành công"
          : "Store created successfully"
      );

      form.reset();
      setPreviewData(null);
      setImageFile(null);
      setImagePreview(null);

      setOpenVerifyCreateForm(false);
    } catch (error) {
      toast.error(
        locale === "vi" ? "Tạo cửa hàng thất bại" : "Failed to create store"
      );
    } finally {
      setIsLoading(false);
    }
  }, [previewData, imageFile, form]);

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
      <div className="grid grid-cols-2 gap-3 w-full min-h-[80vh] my-4 rounded-xl">
        {/*Field*/}
        <div className="bg-background rounded-lg p-4">
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
              {/*Image */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">{tFields("image")}</span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleSelectImage}
                />
                <div
                  onClick={() =>
                    !imagePreview && imageInputRef.current?.click()
                  }
                  className="relative h-[260px] border-2 border-dashed border-gray-300 rounded-xl
      flex items-center justify-center hover:border-blue-500 transition cursor-pointer bg-muted"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="h-full w-auto object-cover rounded-xl"
                      />

                      <Button
                        type="button"
                        className="absolute top-2 right-2 w-8 h-8 rounded-md"
                        variant="outline"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 className="text-red-500" size={18} />
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <span className="text-sm">{t("addImage")}</span>
                      <span className="text-xs text-gray-400 mt-1">
                        (PNG, JPG, JPEG)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/*end img */}
              <div className="flex items-center gap-3">
                <FormFieldCustom
                  name="name"
                  label={tFields("name")}
                  placeholder={tFields("name")}
                />

                <FormFieldCustom
                  name="owner"
                  label={tFields("owner")}
                  placeholder={tFields("owner")}
                  type="select"
                  selectData={OWNER_OPTION}
                />
              </div>
              <FormFieldCustom
                name="openDay"
                label={tFields("openDay")}
                placeholder={tFields("openDay")}
                type="select"
                selectData={OPEN_DAY_OPTION}
              />
              <div className="flex items-center gap-3">
                <FormFieldCustom
                  name="openTime"
                  label={tFields("openTime")}
                  placeholder={tFields("openTime")}
                  type="time"
                />
                <FormFieldCustom
                  name="closeTime"
                  label={tFields("closeTime")}
                  placeholder={tFields("closeTime")}
                  type="time"
                />
              </div>
            </form>
          </FormProvider>
        </div>

        {/*Map */}
        <div className="bg-background rounded-lg p-4">
          <div className="mb-4">
            <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
              {t("rightHeader")}
            </h1>
            <p className="text-gray-500 text-sm">{t("rightSubHeader")}</p>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <p className="text-sm font-medium">Bản đồ</p>
            <div className="w-full h-[260px]">
              <MapCreate />
            </div>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-rhf-demo"
            >
              <FormFieldCustom
                name="address"
                label={tFields("address")}
                placeholder={tFields("address")}
                loading={isGeocoding}
              />
              <div className="flex items-center gap-3">
                <FormFieldCustom
                  name="latitude"
                  label={tFields("latitude")}
                  placeholder={tFields("latitude")}
                  type="number"
                  readOnly={true}
                />
                <FormFieldCustom
                  name="longitude"
                  label={tFields("longitude")}
                  placeholder={tFields("longitude")}
                  type="number"
                  readOnly={true}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {openVerifyCreateForm && (
        <ConfirmPopup
          openVerifyCreateForm={openVerifyCreateForm}
          setOpenVerifyCreateForm={setOpenVerifyCreateForm}
          previewData={previewData}
          imagePreview={imagePreview}
          handleConfirmCreate={handleConfirmCreate}
        />
      )}
    </>
  );
}
