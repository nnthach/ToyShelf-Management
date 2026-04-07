"use client";

import {
  WarehouseFormValues,
  warehouseSchema,
} from "@/src/schemas/warehouse.schema";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit,
  Globe2,
  Lock,
  MapIcon,
  MapPin,
  Navigation,
  Pencil,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash,
  Trash2,
  Unlock,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import {
  deleteWarehouseAPI,
  disableWarehouseAPI,
  restoreWarehouseAPI,
  updateWarehouseAPI,
} from "@/src/services/warehouse.service";
import { getAllCityAPI } from "@/src/services/city.service";
import { City, Warehouse } from "@/src/types";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import MapCreate from "@/src/components/MapCreate";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { useRouter } from "next/navigation";

function UpdateWarehouseModal({ warehouse }: { warehouse: Warehouse }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const {
    suggestions,
    isGeocoding,
    isLoading,
    setIsLoading,
    fetchPlaceDetail,
    fetchSuggestions,
    setInput,
    setSuggestions,
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

  const { data: cityList = [], isLoading: isCityLoading } = useQuery({
    queryKey: ["cities", { isActive: undefined }],
    queryFn: () => getAllCityAPI({ isActive: undefined }),
    select: (res) => res.data as City[],
  });

  const cityOptions = cityList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

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
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Cập nhật kho thất bại"));
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
      toast.error(getErrorMessage(error, "Vô hiệu hóa kho thất bại"));
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
      toast.error(getErrorMessage(error, "Khôi phục kho thất bại"));
    }
  }

  async function handleDelete() {
    try {
      await deleteWarehouseAPI(warehouse.id!);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      form.reset();
      toast.success("Xóa kho thành công");
      router.replace("/admin/warehouse");
    } catch (error) {
      toast.error(getErrorMessage(error, "Khôi phục kho thất bại"));
    }
  }

  return (
    <>
      {isLoading && <LoadingPageComponent />}

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            form.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/30 hover:bg-white/10 text-white/80 rounded-full border border-white/10"
          >
            <Pencil size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          {/* Header đồng bộ */}
          <DialogHeader className="p-6 py-2 bg-slate-50/50 border-b">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Chỉnh sửa kho hàng
            </DialogTitle>
            <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
              <Sparkles size={14} className="text-amber-500" />
              Thông tin vị trí kho sẽ được cập nhật chính xác trên bản đồ.
            </DialogDescription>
          </DialogHeader>

          {/* Form Body - Có Scroll nếu màn hình nhỏ */}
          <div className="p-6 py-0 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {/* SECTION: BẢN ĐỒ */}
              <div className="space-y-1">
                <label className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
                  <MapIcon size={16} className="text-primary" />
                  Vị trí trên bản đồ
                </label>
                <div className="w-full h-[180px] rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 relative group">
                  <MapCreate />
                </div>
              </div>

              {/* SECTION: FORM NHẬP LIỆU */}
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  id="form-update-warehouse"
                >
                  <FormFieldCustom
                    name="name"
                    label="Tên kho"
                    placeholder="Ví dụ: Kho trung chuyển phía Nam"
                    icon={<WarehouseIcon size={18} />}
                    required
                  />

                  <FormFieldCustom
                    name="cityId"
                    label="Thành phố / Tỉnh"
                    placeholder="Chọn thành phố"
                    type="select"
                    selectData={cityOptions}
                    icon={<Globe2 size={18} />}
                    required
                  />

                  <div className="relative group">
                    <FormFieldCustom
                      name="address"
                      label="Địa chỉ chi tiết"
                      labelNote="Tối thiểu 4 ký tự để tìm kiếm"
                      placeholder="Tìm kiếm địa chỉ..."
                      loading={isGeocoding}
                      icon={<MapPin size={18} />}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        setInput(value);
                        form.setValue("address", value);
                      }}
                      required
                    />

                    {/* SUGGESTIONS BOX - Làm lại UI cho mượt */}
                    {suggestions.length > 0 && (
                      <div className="absolute border rounded-xl bg-white z-50 w-full shadow-xl mt-1 max-h-[200px] overflow-y-auto p-1 border-slate-200 animate-in fade-in zoom-in-95">
                        {suggestions.map((item) => (
                          <div
                            key={item.properties.id}
                            className="flex items-start gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors group/item"
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
                            <div className="mt-0.5 p-1.5 rounded-full bg-slate-100 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                              <Search size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-700 line-clamp-1">
                                {item.properties.label}
                              </span>
                              <span className="text-xs text-slate-400 italic">
                                Nhấn để chọn vị trí
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* COORDINATES GRID */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormFieldCustom
                      name="latitude"
                      label="Vĩ độ"
                      placeholder="0.000000"
                      type="number"
                      icon={<Navigation size={16} className="rotate-45" />}
                      className="bg-white/50"
                      required
                    />
                    <FormFieldCustom
                      name="longitude"
                      label="Kinh độ"
                      placeholder="0.000000"
                      type="number"
                      icon={<Navigation size={16} />}
                      className="bg-white/50"
                      required
                    />
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>

          {/* Footer đồng bộ */}
          <DialogFooter className="p-4 py-3 bg-slate-50/50 border-t grid grid-cols-2 gap-2 items-center">
            <div className="col-span-1 flex items-center gap-2">
              {!warehouse?.isActive ? (
                <>
                  <Button
                    onClick={() => handleDelete()}
                    variant="ghost"
                    size="sm"
                    className="flex-1 font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2"
                  >
                    <Trash2 size={16} className="mr-1.5" />
                    Xóa
                  </Button>

                  <Button
                    onClick={() => handleRestore()}
                    variant="ghost"
                    size="sm"
                    className="flex-1 font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2"
                  >
                    <Unlock size={16} className="mr-1.5" />
                    Kích hoạt
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleDisable()}
                  variant="ghost"
                  className="w-full font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <Lock size={16} className="mr-2" />
                  Vô hiệu hóa
                </Button>
              )}
            </div>

            <div className="col-span-1 w-full">
              <Button
                type="submit"
                form="form-update-warehouse"
                variant="success"
                className="w-full gap-2 font-black shadow-md active:scale-95 transition-all uppercase text-[12px] tracking-wider"
              >
                <Send size={16} />
                Xác nhận
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UpdateWarehouseModal;
