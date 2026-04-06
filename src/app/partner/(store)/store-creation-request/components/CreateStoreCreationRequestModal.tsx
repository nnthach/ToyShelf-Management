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
  Globe2,
  MapIcon,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Search,
  Send,
  Sparkles,
  Store,
} from "lucide-react";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import MapCreate from "@/src/components/MapCreate";
import { StoreFormValues, storeSchema } from "@/src/schemas/store.schema";
import { createStoreCreationRequestAPI } from "@/src/services/store-create-request.service";
import { City } from "@/src/types";
import { getAllCityAPI } from "@/src/services/city.service";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

function CreateStoreRequestModal() {
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
    setSuggestions,
    setInput,
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

  async function onSubmit(data: StoreFormValues) {
    setIsLoading(true);

    try {
      await createStoreCreationRequestAPI(data);
      queryClient.invalidateQueries({
        queryKey: ["storeRequests"],
      });
      form.reset();
      toast.success("Tạo cửa hàng thành công");
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Tạo cửa hàng thất bại"));
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
          <Button className="btn-primary-gradient">
            <Plus /> Tạo yêu cầu
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          {/* Header đồng bộ */}
          <DialogHeader className="p-6 py-4 bg-slate-50/50 border-b">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Store className="text-primary" size={24} />
              Tạo yêu cầu cửa hàng mới
            </DialogTitle>
            <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
              <Sparkles size={14} className="text-amber-500" />
              Thông tin cửa hàng sẽ được cập nhật chính xác trên bản đồ khi lưu.
            </DialogDescription>
          </DialogHeader>

          {/* Form Body - Scrollable */}
          <div className="p-6 py-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {/* SECTION: BẢN ĐỒ */}
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

              {/* SECTION: FORM NHẬP LIỆU */}
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  id="form-create-store"
                >
                  {/* Tên cửa hàng */}
                  <FormFieldCustom
                    name="name"
                    label="Tên cửa hàng"
                    placeholder="Ví dụ: Cửa hàng Tiện lợi A"
                    icon={<Store size={18} />}
                    required
                  />

                  {/* Số điện thoại */}
                  <FormFieldCustom
                    name="phoneNumber"
                    label="Số điện thoại liên hệ"
                    placeholder="Ví dụ: 0901234567"
                    icon={<Phone size={18} />}
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

                  {/* Địa chỉ với Suggestions */}
                  <div className="relative group">
                    <FormFieldCustom
                      name="storeAddress"
                      label="Địa chỉ chi tiết"
                      labelNote="Tối thiểu 4 ký tự để tìm kiếm"
                      placeholder="Tìm kiếm địa chỉ từ bản đồ..."
                      loading={isGeocoding}
                      icon={<MapPin size={18} />}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        setInput(value);
                        form.setValue("storeAddress", value);
                      }}
                      required
                    />

                    {/* SUGGESTIONS BOX */}
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

                  {/* COORDINATES GRID - Tọa độ tự động */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormFieldCustom
                      name="latitude"
                      label="Vĩ độ"
                      labelNote="Tự động cập nhật khi tìm kiếm địa chỉ"
                      placeholder="0.000000"
                      type="number"
                      icon={<Navigation size={16} className="rotate-45" />}
                      className="bg-white/50"
                      required
                    />
                    <FormFieldCustom
                      name="longitude"
                      label="Kinh độ"
                      labelNote="Tự động cập nhật khi tìm kiếm địa chỉ"
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
              form="form-create-store"
              className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
              variant="success"
            >
              <Send size={16} />
              Xác nhận tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateStoreRequestModal;
