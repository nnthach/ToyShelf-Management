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
import { Edit, MapPin, Plus } from "lucide-react";
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

function EditStoreModal({ storeId }: { storeId: string }) {
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

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      storeAddress: "",
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

  useEffect(() => {
    if (storeDetail) {
      form.reset({
        name: storeDetail.name,
        storeAddress: storeDetail.storeAddress,
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
  }, [storeDetail, form]);

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
      toast.error("Cập nhật cửa hàng thất bại");
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
            <Edit /> Chỉnh sửa cửa hàng
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa cửa hàng</DialogTitle>
            <DialogDescription>
              Thóng tin cửa hàng đơn giản cả cạp nhất khi lưu.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Bản đồ</p>
            <div className="w-full h-[200px]">
              <MapCreate />
            </div>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-create-store"
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

              <div className="relative">
                <FormFieldCustom
                  name="storeAddress"
                  label="Địa chỉ"
                  placeholder="Địa chỉ"
                  loading={isGeocoding}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    form.setValue("storeAddress", e.target.value);
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy bỏ</Button>
            </DialogClose>
            <Button type="submit" form="form-create-store">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditStoreModal;
