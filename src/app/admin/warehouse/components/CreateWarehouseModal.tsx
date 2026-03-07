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
import { MapPin, Plus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MapCreate from "./MapCreate";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import { createWarehouseAPI } from "@/src/services/warehouse.service";
import { getAllCityAPI } from "@/src/services/city.service";
import { City } from "@/src/types";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

function CreateWarehouseModal() {
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
    console.log("submit data", data);
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
      console.log("create warehouse err", error);
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
        <form>
          <DialogTrigger asChild>
            <Button className="btn-primary-gradient">
              <Plus /> Tạo kho
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tạo kho</DialogTitle>
              <DialogDescription>
                Thóng tin kho đơn giản cả cạp nhất khi lưu.
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
                id="form-create-warehouse"
              >
                <FormFieldCustom
                  name="name"
                  label="Tên kho"
                  placeholder="Tên kho"
                />

                <FormFieldCustom
                  name="cityId"
                  label="Thành phố"
                  placeholder="Chọn thành phố"
                  type="select"
                  selectData={cityOptions}
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
              <Button type="submit" form="form-create-warehouse">
                Xuất bản
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}

export default CreateWarehouseModal;
