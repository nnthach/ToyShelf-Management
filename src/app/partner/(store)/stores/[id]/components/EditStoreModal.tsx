"use client";

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
  MapIcon,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Store,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import MapCreate from "@/src/components/MapCreate";
import { StoreFormValues, storeSchema } from "@/src/schemas/store.schema";
import {
  getStoreDetailAPI,
  updateStoreAPI,
} from "@/src/services/store.service";
import { getAllCityAPI } from "@/src/services/city.service";
import { City } from "@/src/types";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

function EditStoreModal({ storeId }: { storeId: string }) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data: cityList = [] } = useQuery({
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
    setInput,
    setSuggestions,
  } = useMapCreate();

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      storeAddress: "",
      cityId: "",
      phoneNumber: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const { data: storeDetail, isLoading: isStoreLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreDetailAPI(storeId),
    select: (res) => res.data,
    enabled: !!storeId,
  });

  console.log("storeDetail", storeDetail);

  useEffect(() => {
    if (storeDetail) {
      form.reset({
        name: storeDetail.name,
        storeAddress: storeDetail.storeAddress,
        cityId: storeDetail.cityId,
        phoneNumber: storeDetail.phoneNumber,
        latitude: storeDetail.latitude,
        longitude: storeDetail.longitude,
      });

      window.dispatchEvent(
        new CustomEvent("map:flyTo", {
          detail: { lat: storeDetail.latitude, lng: storeDetail.longitude },
        }),
      );
    }
  }, [storeDetail, cityList, form]);

  async function onSubmit(data: StoreFormValues) {
    setIsLoading(true);

    try {
      await updateStoreAPI(data, storeId);
      queryClient.invalidateQueries({
        queryKey: ["stores"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["store", storeId],
      });
      form.reset();
      toast.success("Cập nhật cửa hàng thành công");
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Cập nhật cửa hàng thất bại"));
    } finally {
      setIsLoading(false);
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
            className="h-7 w-7 bg-white/5 hover:bg-white/10 text-white/70 rounded-full border border-white/10"
          >
            <Pencil size={12} />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 py-4 bg-slate-50/50 border-b">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Store className="text-primary" size={24} />
              Chỉnh sửa thông tin cửa hàng
            </DialogTitle>
            <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
              <Sparkles size={14} className="text-amber-500" />
              Thông tin cửa hàng sẽ được cập nhật chính xác trên bản đồ khi lưu.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 py-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
                  <MapIcon size={16} className="text-primary" />
                  Vị trí trên bản đồ
                </label>
                <div className="w-full h-[180px] rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 relative group">
                  <MapCreate />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-[10px] font-bold text-slate-500 uppercase tracking-tight border shadow-sm">
                    Live Preview
                  </div>
                </div>
              </div>

              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                  id="form-edit-store"
                >
                  <FormFieldCustom
                    name="name"
                    label="Tên cửa hàng"
                    placeholder="Tên cửa hàng"
                  />

                  <FormFieldCustom
                    name="phoneNumber"
                    label="Số điện thoại"
                    placeholder="Số điện thoại"
                  />

                  <FormFieldCustom
                    name="cityId"
                    label="Thành phố / Tỉnh"
                    placeholder="Chọn thành phố"
                    type="select"
                    selectData={cityOptions}
                    icon={<Globe2 size={18} />}
                  />

                  <div className="relative">
                    <FormFieldCustom
                      name="storeAddress"
                      label="Địa chỉ"
                      placeholder="Địa chỉ"
                      loading={isGeocoding}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        setInput(value);
                        form.setValue("storeAddress", value);
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

                              form.setValue("storeAddress", address);
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
                      placeholder="Vũ độ"
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
          </div>

          <DialogFooter className="p-4 bg-slate-50/50 border-t flex gap-3">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="flex-1 font-medium text-slate-600 hover:bg-slate-200"
              >
                Hủy bỏ
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="form-edit-store"
              className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
              variant="success"
            >
              <Edit size={16} />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditStoreModal;
