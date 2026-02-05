import MapCreate from "@/src/components/MapCreate";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import {
  WarehouseFormValues,
  warehouseSchema,
} from "@/src/schemas/warehouse.schema";
import { deleteWarehouseAPI, disableWarehouseAPI, restoreWarehouseAPI, updateWarehouseAPI } from "@/src/services/warehouse.service";

import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { Button } from "@/src/styles/components/ui/button";
import { Warehouse } from "@/src/types";
import { formatToSlug } from "@/src/utils/format";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Lock, MapPin, RotateCcw, Trash2 } from "lucide-react";
import { ChangeEvent, memo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type WarehouseFormSheetProps = {
  warehouse: Warehouse;
  onClose: () => void;
};
function WarehouseFormSheet({ warehouse, onClose }: WarehouseFormSheetProps) {
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
      toast.success("Cập nhật kho thành công");
    } catch (error) {
      console.log("Update warehouse err", error);
      toast.error("Cập nhật kho thất bại");
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
      toast.success("Vô hiệu hóa kho thành công");
    } catch (error) {
      console.log("Disable warehouse err", error);
      toast.error("Vô hiệu hóa kho thất bại");
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
      toast.success("Khôi phục kho thành công");
    } catch (error) {
      console.log("Restore warehouse err", error);
      toast.error("Khôi phục kho thất bại");
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
      toast.success("Xóa kho thành công");
    } catch (error) {
      console.log("Delete warehouse err", error);
      toast.error("Xóa kho thất bại");
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
              label="Tên kho"
              placeholder="Tên kho"
            />

            <div className="relative">
              <FormFieldCustom
                name="address"
                label="Địa chỉ"
                placeholder="Địa chỉ"
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
                label="Vĩ độ"
                placeholder="Vĩ độ"
                type="number"
                readOnly={true}
              />
              <FormFieldCustom
                name="longitude"
                label="Kinh độ"
                placeholder="Kinh độ"
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
              title="Vô hiệu hóa"
              onClick={() => handleDisable()}
            >
              <Lock color="red" />
            </Button>
          ) : (
            <div>
              <Button
                variant="outline"
                title="Xóa"
                onClick={() => handleDelete()}
              >
                <Trash2 color="red" />
              </Button>

              <Button
                variant="outline"
                title="Khôi phục"
                onClick={() => handleRestore()}
              >
                <RotateCcw color="aqua" />
              </Button>
            </div>
          )}
          <Button type="submit" form="form-update-warehouse" className="flex-1">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(WarehouseFormSheet);
