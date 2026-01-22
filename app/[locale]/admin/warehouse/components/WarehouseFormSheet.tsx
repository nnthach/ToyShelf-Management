import MapCreate from "@/shared/components/MapCreate";
import { useMapCreate } from "@/shared/hooks/useMapCreate";
import {
  WarehouseFormValues,
  warehouseSchema,
} from "@/shared/schemas/warehouse.schema";
import {
  deleteWarehouseAPI,
  disableWarehouseAPI,
  restoreWarehouseAPI,
  updateWarehouseAPI,
} from "@/shared/services/warehouse.service";
import { FormFieldCustom } from "@/shared/styles/components/custom/FormFieldCustom";
import { Button } from "@/shared/styles/components/ui/button";
import { Warehouse } from "@/shared/types";
import { formatToSlug } from "@/shared/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Lock, MapPin, RotateCcw, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import { ChangeEvent, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslations } from "use-intl";

type WarehouseFormSheetProps = {
  warehouse: Warehouse;
  onClose: () => void;
};
function WarehouseFormSheet({ warehouse, onClose }: WarehouseFormSheetProps) {
  const locale = useLocale();
  const tFields = useTranslations("admin.warehouse.fields");
  const tStatus = useTranslations("status.partner");
  const tCommon = useTranslations("common");
  const tButton = useTranslations("admin.button");
  const tButtonCommon = useTranslations("button");
  const queryClient = useQueryClient();

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

  console.log("ware house", warehouse);

  useEffect(() => {
    if (warehouse) {
      form.reset({
        name: warehouse.name,
        address: warehouse.address,
        code: warehouse.code,
      });
    }
  }, [warehouse, form]);

  async function onSubmit(data: WarehouseFormValues) {
    const payload = {
      ...data,
      code: formatToSlug(data.name),
    };

    try {
      await updateWarehouseAPI(payload, warehouse.id!);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["warehouse", warehouse.id],
      });

      form.reset();
      toast.success(
        locale === "vi"
          ? "Cập nhật kho thành công"
          : "Update warehouse successfully!",
      );
    } catch (error) {
      console.log("Update warehouse err", error);
      toast.error(
        locale === "vi"
          ? "Cập nhật kho thất bại"
          : "Failed to update warehouse",
      );
    }
  }

  async function handleDisable() {
    try {
      await disableWarehouseAPI(warehouse.id!);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["warehouse", warehouse.id],
      });

      form.reset();
      toast.success(
        locale === "vi"
          ? "Vô hiệu hóa kho thành công"
          : "Disable warehouse successfully!",
      );
    } catch (error) {
      console.log("Disable warehouse err", error);
      toast.error(
        locale === "vi"
          ? "Vô hiệu hóa kho thất bại"
          : "Failed to disable warehouse",
      );
    }
  }

  async function handleRestore() {
    try {
      await restoreWarehouseAPI(warehouse.id!);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["warehouse", warehouse.id],
      });

      form.reset();
      toast.success(
        locale === "vi"
          ? "Khôi phục kho thành công"
          : "Restore warehouse successfully!",
      );
    } catch (error) {
      console.log("Restore warehouse err", error);
      toast.error(
        locale === "vi"
          ? "Khôi phục kho thất bại"
          : "Failed to restore warehouse",
      );
    }
  }

  async function handleDelete() {
    try {
      await deleteWarehouseAPI(warehouse.id!);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      form.reset();
      onClose();
      toast.success(
        locale === "vi"
          ? "Xóa kho thành công"
          : "Delete warehouse successfully!",
      );
    } catch (error) {
      console.log("Delete warehouse err", error);
      toast.error(
        locale === "vi" ? "Xóa kho thất bại" : "Failed to delete warehouse",
      );
    }
  }

  return (
    <div className="bg-background flex-1 border-t border-border flex flex-col">
      <div className="grid flex-1 auto-rows-min gap-6 px-4 mt-4">
        <div className="flex flex-col gap-2 mb-3">
          <p className="text-sm font-medium">Bản đồ</p>
          <div className="w-full h-[200px]">
            <MapCreate />
          </div>
        </div>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            id="form-update-warehouse"
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
      </div>

      <div className="border-t border-border px-4 py-3 mt-auto">
        <div className="flex items-center justify-between gap-2">
          {warehouse?.isActive ? (
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
          <Button type="submit" form="form-update-warehouse" className="flex-1">
            {tButton("saveChange")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WarehouseFormSheet;
