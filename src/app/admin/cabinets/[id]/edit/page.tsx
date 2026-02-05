"use client";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { Button } from "@/src/styles/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, MapPin, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ConfirmPopup from "../../create/ConfirmPopup";
import { StoreFormValues, storeSchema } from "@/src/schemas/store.schema";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/src/hooks/useDebounce";

import { toast } from "react-toastify";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { OPEN_DAY_OPTION } from "@/src/constants/openday-option";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import MapCreate from "@/src/components/MapCreate";
import {
  getStoreDetailAPI,
  updateStoreAPI,
} from "@/src/services/store.service";
import { QueryParams } from "@/src/types/SubType";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { Partner } from "@/src/types";
import { formatToSlug } from "@/src/utils/format";

export default function EditStPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [openVerifyCreateForm, setOpenVerifyCreateForm] = useState(false);
  const [showDropdownPartner, setShowDropdownPartner] = useState(false);
  const [searchPartner, setSearchPartner] = useState("");

  const { data: storeDetail } = useQuery({
    queryKey: ["store", id],
    queryFn: () => getStoreDetailAPI(id!),
    select: (res) => res.data,
    enabled: !!id,
  });

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      partnerID: "",
      storeAddress: "",
      phoneNumber: "",
      code: "",
    },
  });

  useEffect(() => {
    if (storeDetail) {
      form.reset({
        name: storeDetail.name,
        storeAddress: storeDetail.storeAddress,
        phoneNumber: storeDetail.phoneNumber,
        partnerID: storeDetail.partnerID,
        code: storeDetail.code,
      });
    }
  }, [storeDetail, form]);

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

  // support select partner
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
      toast.warn(`Chọn tệp hình ảnh hợp lệ`);
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
    form.setValue("partnerID", partner.id);
    setSearchPartner(partner.companyName);
    setShowDropdownPartner(false);
    updateQuery({ search: "" });
  };

  // Show confirm modal
  function onSubmit(data: StoreFormValues) {
    setPreviewData(data);
    setOpenVerifyCreateForm(true);
  }

  const handleConfirmUpdate = useCallback(async () => {
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

      const res = await updateStoreAPI(previewData, id);

      console.log("res", res);

      toast.success("Cập nhật cửa hàng thành công");

      form.reset();
      setPreviewData(null);
      setImageFile(null);
      setImagePreview(null);

      setOpenVerifyCreateForm(false);
      router.back();
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
            Chỉnh sửa tủ
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
              Hình ảnh
            </h1>
            <p className="text-gray-500 text-sm">grggrgr</p>
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
                <FormFieldCustom name="name" label="Tên" placeholder="Tên" />

                <div
                  className="relative w-full"
                  tabIndex={-1}
                  onBlur={() => setShowDropdownPartner(false)}
                >
                  <FormFieldCustom
                    name="partnerID"
                    label="Chủ sở hữu"
                    placeholder="Chủ sở hữu"
                    value={searchPartner}
                    onFocus={() => setShowDropdownPartner(true)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchPartner(e.target.value);
                      form.setValue("partnerID", "");
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
                    </ul>
                  )}
                </div>
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
          handleConfirmCreateOrUpdate={handleConfirmUpdate}
        />
      )}
    </>
  );
}
