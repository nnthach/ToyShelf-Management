import MapCreate from "@/src/components/MapCreate";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import {
  WarehouseFormValues,
  warehouseSchema,
} from "@/src/schemas/warehouse.schema";
import { getAllCityAPI } from "@/src/services/city.service";
import {
  deleteWarehouseAPI,
  disableWarehouseAPI,
  restoreWarehouseAPI,
  updateWarehouseAPI,
} from "@/src/services/warehouse.service";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { Button } from "@/src/styles/components/ui/button";
import { City, Warehouse } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Globe2,
  Lock,
  MapIcon,
  MapPin,
  Navigation,
  RotateCcw,
  Save,
  Trash2,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { ChangeEvent, memo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type WarehouseFormSheetProps = {
  warehouse: Warehouse;
  onClose: () => void;
};
function WarehouseFormSheet({ warehouse, onClose }: WarehouseFormSheetProps) {
  const queryClient = useQueryClient();

  const { data: cityList = [], isLoading: isCityLoading } = useQuery({
    queryKey: ["cities", { isActive: undefined }],
    queryFn: () => getAllCityAPI({ isActive: undefined }),
    select: (res) => res.data as City[],
  });

  const cityOptions = cityList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const {
    suggestions,
    isGeocoding,
    isLoading,
    setIsLoading,
    fetchPlaceDetail,
    fetchSuggestions,
    setSuggestions,
    setInput,
  } = useMapCreate();

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      address: "",
      code: "",
      cityId: "",
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (warehouse) {
      form.reset({
        name: warehouse.name,
        address: warehouse.address,
        code: warehouse.code,
        cityId: warehouse.cityId,
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
      });

      window.dispatchEvent(
        new CustomEvent("map:flyTo", {
          detail: { lat: warehouse.latitude, lng: warehouse.longitude },
        }),
      );
    }
  }, [warehouse, form]);

  async function onSubmit(data: WarehouseFormValues) {
    try {
      await updateWarehouseAPI(data, warehouse.id!);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["warehouse", warehouse.id],
      });

      form.reset();
      toast.success("Cập nhật kho thành công");
    } catch (error) {
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
      toast.error("Xóa kho thất bại");
    }
  }

  return (
    <div className="bg-background flex-1 border-t border-border flex flex-col">
      <div className="grid flex-1 auto-rows-min gap-4 px-4 mt-4">
        <div className="flex flex-col gap-2 mb-2">
          <label className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
            <MapIcon size={16} className="text-primary" />
            Vị trí trên bản đồ
          </label>
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
              icon={<WarehouseIcon size={18} />}
            />

            <FormFieldCustom
              name="cityId"
              label="Thành phố"
              placeholder="Chọn thành phố"
              type="select"
              selectData={cityOptions}
              icon={<Globe2 size={18} />}
            />

            <div className="relative">
              <FormFieldCustom
                name="address"
                label="Địa chỉ"
                placeholder="Địa chỉ"
                loading={isGeocoding}
                icon={<MapPin size={18} />}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setInput(value);
                  form.setValue("address", e.target.value);
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
                        form.setValue("latitude", lat);
                        form.setValue("longitude", lng);

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
                placeholder="0.000000"
                type="number"
                readOnly={true}
                icon={<Navigation size={16} className="rotate-45" />}
                className="bg-white/50"
              />
              <FormFieldCustom
                name="longitude"
                label="Kinh độ"
                placeholder="0.000000"
                type="number"
                readOnly={true}
                icon={<Navigation size={16} />}
                className="bg-white/50"
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
            <Save />
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(WarehouseFormSheet);
