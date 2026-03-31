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
  Globe2,
  MapIcon,
  MapPin,
  Navigation,
  Plus,
  Search,
  Send,
  Sparkles,
  Warehouse,
} from "lucide-react";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import { createWarehouseAPI } from "@/src/services/warehouse.service";
import { getAllCityAPI } from "@/src/services/city.service";
import { City } from "@/src/types";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import MapCreate from "@/src/components/MapCreate";

function CreateWarehouseModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const {
    suggestions,
    isGeocoding,
    isLoading,
    setIsLoading,
    fetchPlaceDetail,
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

  async function onSubmit(data: WarehouseFormValues) {
    setIsLoading(true);

    try {
      await createWarehouseAPI(data);
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });
      form.reset();
      toast.success("Tạo kho thành công");
      setOpen(false);
    } catch (error) {
      toast.error("Tạo kho thất bại");
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
            <Plus /> Tạo kho
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          {/* Header đồng bộ */}
          <DialogHeader className="p-6 py-2 bg-slate-50/50 border-b">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Tạo kho hàng mới
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
                  id="form-create-warehouse"
                >
                  <FormFieldCustom
                    name="name"
                    label="Tên kho"
                    placeholder="Ví dụ: Kho trung chuyển phía Nam"
                    icon={<Warehouse size={18} />}
                  />

                  <FormFieldCustom
                    name="cityId"
                    label="Thành phố / Tỉnh"
                    placeholder="Chọn thành phố"
                    type="select"
                    selectData={cityOptions}
                    icon={<Globe2 size={18} />}
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
                    />

                    {/* SUGGESTIONS BOX - Làm lại UI cho mượt */}
                    {suggestions.length > 0 && (
                      <div className="absolute border rounded-xl bg-white z-50 w-full shadow-xl mt-1 max-h-[200px] overflow-y-auto p-1 border-slate-200 animate-in fade-in zoom-in-95">
                        {suggestions.map((item) => (
                          <div
                            key={item.properties.id}
                            title={item.properties.label}
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
          </div>

          {/* Footer đồng bộ */}
          <DialogFooter className="p-4 py-2 bg-slate-50/50 border-t flex gap-3">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="flex-1 font-medium text-slate-600"
              >
                Hủy bỏ
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="form-create-warehouse"
              variant="success"
              className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            >
              <Send size={16} />
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateWarehouseModal;
