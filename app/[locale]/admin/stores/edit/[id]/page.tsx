"use client";
import { ProductCategoryData } from "@/shared/constants/fakeData";
import { FormFieldCustom } from "@/shared/styles/components/custom/FormFieldCustom";
import ModelThreeDPreview from "@/shared/styles/components/custom/ModelThreeDPreview";
import { Button } from "@/shared/styles/components/ui/button";
import { SelectOption } from "@/shared/types/SubType";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import MapCreate from "../../create/MapCreate";

type EditProductPageProps = {
  params: {
    id: string;
  };
};

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  const router = useRouter();
  const t = useTranslations("admin.stores.editStore");
  const tButton = useTranslations("admin.button");
  const tFields = useTranslations("admin.stores.fields");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isGeocoding, setIsGeocoding] = useState(false);

  const formSchema = z.object({
    name: z.string(),
    address: z.string(),
    openDay: z.string(),
    openTime: z.string(),
    closeTime: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      openDay: "",
      openTime: "",
      closeTime: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const address = form.watch("address");

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

  /*IMAGE */
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log("image files:", imageFile);
    console.log(data);
  }

  return (
    <>
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
          {tButton("saveChange")}
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
              <FormFieldCustom
                name="name"
                label={tFields("name")}
                placeholder={tFields("name")}
              />
              <FormFieldCustom
                name="openDay"
                label={tFields("openDay")}
                placeholder={tFields("openDay")}
                type="number"
              />
              <div className="flex items-center gap-3">
                <FormFieldCustom
                  name="openTime"
                  label={tFields("openTime")}
                  placeholder={tFields("openTime")}
                  type="number"
                />
                <FormFieldCustom
                  name="closeTime"
                  label={tFields("closeTime")}
                  placeholder={tFields("closeTime")}
                  type="number"
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
    </>
  );
}
