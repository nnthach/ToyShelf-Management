"use client";

import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { Button } from "@/src/styles/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import MapCreate from "@/src/components/MapCreate";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { Partner } from "@/src/types";
import { FormProvider, useForm } from "react-hook-form";
import { StoreFormValues, storeSchema } from "@/src/schemas/store.schema";
import { QueryParams } from "@/src/types/SubType";
import { toast } from "react-toastify";
import { formatToSlug } from "@/src/utils/format";
import { createStoreAPI } from "@/src/services/store.service";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { OPEN_DAY_OPTION } from "@/src/constants/openday-option";
import ConfirmPopup from "./ConfirmPopup";

export default function AdminCreateStorePage() {
  const router = useRouter();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [openVerifyCreateForm, setOpenVerifyCreateForm] = useState(false);
  const [showDropdownPartner, setShowDropdownPartner] = useState(false);
  const [searchPartner, setSearchPartner] = useState("");

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      partnerId: "",
      storeAddress: "",
      phoneNumber: "",
      code: "",
      // openDay: "",
      // openTime: "",
      // closeTime: "",
      // latitude: 0,
      // longitude: 0,
    },
  });
  const [previewData, setPreviewData] = useState<StoreFormValues | null>(null);

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: true,
    search: "",
  });

  const {
    suggestions,
    isGeocoding,
    isLoading,
    setIsLoading,
    fetchPlaceDetail,
    fetchSuggestions,
    setSuggestions,
  } = useMapCreate();

  const { data: partnerList = [] } = useQuery({
    queryKey: ["partners", query],
    queryFn: () => getAllPartnerAPI(query),
    select: (res) => res.data as Partner[],
  });

  const debouncedSearch = useDebounce(searchPartner, 500);

  useEffect(() => {
    updateQuery({
      search: debouncedSearch || "",
    });
  }, [debouncedSearch]);

  /*IMAGE */
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warn("Vui lòng chọn hình ảnh");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // reset input để chọn lại cùng file
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  /*END IMAGE */

  /*Select partner */
  const handleSelectPartner = (partner: Partner) => {
    form.setValue("partnerId", partner.id);
    setSearchPartner(partner.companyName);
    setShowDropdownPartner(false);
    updateQuery({ search: "" });
  };

  // Show confirm modal
  function onSubmit(data: StoreFormValues) {
    setPreviewData(data);
    setOpenVerifyCreateForm(true);
  }

  const handleConfirmCreate = useCallback(async () => {
    if (!previewData) return;

    console.log("previewData", previewData);
    const payload = {
      ...previewData,
      code: formatToSlug(previewData.name),
    };
    console.log("payload", payload);

    setIsLoading(true);
    try {
      // const imageUrl = imageFile
      //   ? await uploadFileToCloudinary(imageFile, "store")
      //   : null;

      const res = await createStoreAPI(payload);

      console.log("res", res);

      toast.success("Tạo cửa hàng thành công");

      form.reset();
      setPreviewData(null);
      setImageFile(null);
      setImagePreview(null);

      setOpenVerifyCreateForm(false);
    } catch (error) {
      toast.error("Tạo cửa hàng thất bại");
    } finally {
      setIsLoading(false);
    }
  }, [previewData, imageFile, form]);

  return (
    <>
      {isLoading && <LoadingPageComponent />}

      {/*Header */}
      <div className="flex items-center justify-between">
        {/*Left */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => router.back()}
            className="w-8 h-8"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-bold dark:text-foreground">
            Tạo cửa hàng
          </h1>
        </div>
        {/*Right */}
        <Button
          type="submit"
          form="form-rhf-demo"
          className="btn-primary-gradient"
        >
          Xác nhận
          <Check />
        </Button>
      </div>

      {/*Content */}
      <div className="grid grid-cols-3 gap-3 w-full min-h-[80vh] my-4 rounded-xl">
        {/*Field*/}
        <div className="bg-background rounded-lg p-4">
          <div className="mb-4">
            <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
              Thông tin cửa hàng
            </h1>
            <p className="text-gray-500 text-sm">
              Nhập đầy đủ thông tin cửa hàng
            </p>
          </div>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-rhf-demo"
            >
              {/*Image */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Hình ảnh</span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleSelectImage}
                />
                <div
                  onClick={() =>
                    !imagePreview && imageInputRef.current?.click()
                  }
                  className="relative h-[260px] border-2 border-dashed border-gray-300 rounded-xl
      flex items-center justify-center hover:border-blue-500 transition cursor-pointer bg-muted"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="h-full w-auto object-cover rounded-xl"
                      />

                      <Button
                        type="button"
                        className="absolute top-2 right-2 w-8 h-8 rounded-md"
                        variant="outline"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 className="text-red-500" size={18} />
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <span className="text-sm">Thêm hình ảnh</span>
                      <span className="text-xs text-gray-400 mt-1">
                        (PNG, JPG, JPEG)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/*end img */}

              <div className="flex items-center gap-3">
                <FormFieldCustom
                  name="name"
                  label="Tên cửa hàng"
                  placeholder="Tên cửa hàng"
                />

                <div
                  className="relative w-full"
                  tabIndex={-1}
                  onBlur={() => setShowDropdownPartner(false)}
                >
                  <FormFieldCustom
                    name="partnerId"
                    label="Chủ quản lý"
                    placeholder="Chủ quản lý"
                    value={searchPartner}
                    onFocus={() => setShowDropdownPartner(true)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchPartner(e.target.value);
                      form.setValue("partnerId", "");
                      setShowDropdownPartner(true);
                    }}
                  />

                  {showDropdownPartner && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-auto">
                      {partnerList.length > 0 ? (
                        partnerList.map((partner) => (
                          <li
                            key={partner.id}
                            onMouseDown={() => handleSelectPartner(partner)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                          >
                            <div className="font-medium">
                              {partner.companyName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {partner.email}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-sm text-gray-400 select-none">
                          Not found partner
                        </li>
                      )}
                      {partnerList.length === 0 && (
                        <li className="px-4 py-2 text-sm text-gray-400 select-none">
                          Không tìm thấy đối tác
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FormFieldCustom
                  name="openDay"
                  label="Ngày mở"
                  placeholder="Ngày mở"
                  type="select"
                  selectData={OPEN_DAY_OPTION}
                />

                <FormFieldCustom
                  name="phoneNumber"
                  label="Số điện thoại"
                  placeholder="Số điện thoại"
                />
              </div>
              <div className="flex items-center gap-3">
                <FormFieldCustom
                  name="openTime"
                  label="Giờ mở cửa"
                  placeholder="Giờ mở cửa"
                  type="time"
                />
                <FormFieldCustom
                  name="closeTime"
                  label="Giờ đóng cửa"
                  placeholder="Giờ đóng cửa"
                  type="time"
                />
              </div>
            </form>
          </FormProvider>
        </div>

        {/*Map */}
        <div className="bg-background rounded-lg p-4">
          <div className="mb-4">
            <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
              Địa chỉ
            </h1>
            <p className="text-gray-500 text-sm">Nhập địa chỉ cửa hàng</p>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <p className="text-sm font-medium">Bản đồ</p>
            <div className="w-full h-[260px]">
              <MapCreate />
            </div>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-rhf-demo"
            >
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
                  label="Kinh độ"
                  placeholder="Kinh độ"
                  type="number"
                  readOnly={true}
                />
                <FormFieldCustom
                  name="longitude"
                  label="Vĩ độ"
                  placeholder="Vĩ độ"
                  type="number"
                  readOnly={true}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {openVerifyCreateForm && (
        <ConfirmPopup
          isLoading={isLoading}
          openVerifyCreateForm={openVerifyCreateForm}
          setOpenVerifyCreateForm={setOpenVerifyCreateForm}
          previewData={previewData}
          imagePreview={imagePreview}
          handleConfirmCreateOrUpdate={handleConfirmCreate}
        />
      )}
    </>
  );
}
