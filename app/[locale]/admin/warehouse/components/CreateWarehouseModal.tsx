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
import { ChangeEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MapCreate from "./MapCreate";
import { OpenMapFeature, PlaceDetail } from "@/shared/types/SubType";
import { formatToSlug } from "@/shared/utils/format";
import { useMapCreate } from "@/shared/hooks/useMapCreate";

function CreateWarehouseModal() {
  const locale = useLocale();
  const tButton = useTranslations("admin.button");
  const tStatus = useTranslations("status.partner");
  const tCommon = useTranslations("common");
  const tFields = useTranslations("admin.warehouse.fields");
  const tCreatePartner = useTranslations("admin.warehouse.createWarehouse");
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const {
    suggestions,
    isGeocoding,
    isLoading,
    setIsLoading,
    fetchPlaceDetail,
    fetchSuggestions,
    setSuggestions,
  } = useMapCreate();

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      address: "",
      code: "",
    },
  });

  async function onSubmit(data: WarehouseFormValues) {
    const payload = {
      ...data,
      code: formatToSlug(data.name),
    };

    console.log("payload", payload);

    try {
      await createWarehouseAPI(payload);
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });
      form.reset();
      toast.success(
        locale === "vi"
          ? "Tạo kho thành công"
          : "Create warehouse successfully!",
      );
      setOpen(false);
    } catch (error) {
      console.log("create warehouse err", error);
      toast.error(
        locale === "vi" ? "Tạo kho thất bại" : "Failed to create warehouse",
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
            <Plus /> {tCreatePartner("header")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tCreatePartner("header")}</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{tCommon("map")}</p>
            <div className="w-full h-[200px]">
              <MapCreate />
            </div>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-create-warehouse"
            >
              <FormFieldCustom
                name="name"
                label={tFields("name.label")}
                placeholder={tFields("name.label")}
              />

              <div className="relative">
                <FormFieldCustom
                  name="address"
                  label={tFields("address.label")}
                  placeholder={tFields("address.label")}
                  loading={isGeocoding}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    form.setValue("address", e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                />

                {suggestions.length > 0 && (
                  <div className="absolute border rounded-md bg-background z-10 w-full shadow max-h-[120px] overflow-y-auto">
                    {suggestions.map((item) => (
                      <div
                        key={item.properties.id}
                        className="px-3 py-2 hover:bg-muted cursor-pointer"
                        onClick={async () => {
                          const detail = await fetchPlaceDetail(
                            item.properties.id,
                          );

                          if (!detail) return;

                          const { lat, lng, address } = detail;
                          form.setValue("address", address);
                          // form.setValue("latitude", lat);
                          // form.setValue("longitude", lng);

                          window.dispatchEvent(
                            new CustomEvent("map:flyTo", {
                              detail: { lat, lng },
                            }),
                          );

                          setSuggestions([]);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={18} />
                          {item.properties.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <FormFieldCustom
                  name="latitude"
                  label={tFields("latitude.label")}
                  placeholder={tFields("latitude.label")}
                  type="number"
                  readOnly={true}
                />
                <FormFieldCustom
                  name="longitude"
                  label={tFields("longitude.label")}
                  placeholder={tFields("longitude.label")}
                  type="number"
                  readOnly={true}
                />
              </div>
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="form-create-warehouse">
              {tButton("publish")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateWarehouseModal;
