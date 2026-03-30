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
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import MapCreate from "@/src/components/MapCreate";
import { StoreFormValues, storeSchema } from "@/src/schemas/store.schema";
import { createStoreAPI } from "@/src/services/store.service";
import { useAuth } from "@/src/hooks/useAuth";

function CreateStoreModal() {
  const queryClient = useQueryClient();

  const { partner } = useAuth();

  const partnerId = partner?.partnerId;

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

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      partnerId: "",
      storeAddress: "",
      phoneNumber: "",
      code: "",
      latitude: 0,
      longitude: 0,
    },
  });

  async function onSubmit(data: StoreFormValues) {
    setIsLoading(true);

    const payload = {
      ...data,
      partnerId: partnerId || "",
    };

    try {
      await createStoreAPI(payload);
      queryClient.invalidateQueries({
        queryKey: ["stores"],
      });
      form.reset();
      toast.success("Tạo cửa hàng thành công");
      setOpen(false);
    } catch (error) {
      toast.error("Tạo cửa hàng thất bại");
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
            <Plus /> Tạo cửa hàng
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo cửa hàng</DialogTitle>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy bỏ</Button>
            </DialogClose>
            <Button type="submit" form="form-create-store">
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateStoreModal;
