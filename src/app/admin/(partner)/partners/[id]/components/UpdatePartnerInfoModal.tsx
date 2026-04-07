import MapCreate from "@/src/components/MapCreate";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import {
  UpdatePartnerFormValues,
  updatePartnerSchema,
} from "@/src/schemas/partner.schema";
import { getAllPartnerTierAPI } from "@/src/services/partner-tier.service";
import { updatePartnerAPI } from "@/src/services/partner.service";
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
import { Partner, PartnerTier } from "@/src/types";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Edit,
  Info,
  MapIcon,
  MapPin,
  Navigation,
  Pencil,
  Search,
  ShieldCheck,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

function UpdatePartnerInfoModal({ partner }: { partner: Partner }) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const {
    suggestions,
    isGeocoding,
    fetchPlaceDetail,
    setInput,
    setSuggestions,
  } = useMapCreate();

  const form = useForm<UpdatePartnerFormValues>({
    resolver: zodResolver(updatePartnerSchema),
    defaultValues: {
      companyName: "",
      partnerTierId: "",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (partner) {
      form.reset({
        companyName: partner.companyName,
        address: partner.address,
        latitude: partner.latitude,
        longitude: partner.longitude,
        partnerTierId: partner.partnerTierId,
      });

      window.dispatchEvent(
        new CustomEvent("map:flyTo", {
          detail: { lat: partner.latitude, lng: partner.longitude },
        }),
      );
    }
  }, [partner, form]);

  const { data: partnerTierList = [] } = useQuery({
    queryKey: ["partnerTiers", { isActive: undefined }],
    queryFn: () => getAllPartnerTierAPI({ isActive: undefined }),
    select: (res) => res.data as PartnerTier[],
  });

  async function onSubmit(data: UpdatePartnerFormValues) {
    try {
      await updatePartnerAPI(data, partner.id!);

      queryClient.invalidateQueries({
        queryKey: ["partners"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["partner", partner.id],
      });

      form.reset();
      toast.success("Chỉnh sửa đối tác thành công");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Chỉnh sửa đối tác thất bại"));
    }
  }

  const partnerTierOptions = partnerTierList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
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
          variant="secondary"
          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-md text-[12px] border border-white/10"
        >
          <Edit />
          Chỉnh sửa thông tin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header với Background nhẹ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800">
            Chỉnh sửa đối tác
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1 mt-0.5">
            <Info size={14} /> Cập nhật thông tin đối tác chính xác.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6 py-0 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {/* SECTION: BẢN ĐỒ */}
            <div className="space-y-1">
              <label className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
                <MapIcon size={16} className="text-primary" />
                Vị trí công ty đối tác bản đồ
              </label>
              <div className="w-full h-[180px] rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 relative group">
                <MapCreate />
              </div>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                id="form-create-partner"
              >
                <div className="grid gap-4">
                  <FormFieldCustom
                    name="companyName"
                    label="Tên công ty"
                    icon={<Building2 size={18} />}
                    placeholder="Nhập tên chính thức của doanh nghiệp..."
                    required
                  />

                  <FormFieldCustom
                    name="partnerTierId"
                    label="Phân cấp đối tác"
                    icon={<ShieldCheck size={18} />}
                    placeholder="Chọn hạng mức hợp tác"
                    type="select"
                    selectData={partnerTierOptions}
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
                </div>
              </form>
            </FormProvider>
          </div>
        </div>

        {/* Footer với style sạch sẽ */}
        <DialogFooter className="p-6 bg-slate-50/50 border-t flex gap-3 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 sm:flex-none font-medium text-slate-600 hover:bg-slate-200"
            >
              Hủy bỏ
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-create-partner"
            className="flex-1 sm:flex-none min-w-[120px] gap-2 font-bold shadow-sm"
            variant="success"
          >
            <Edit className="h-4 w-4" />
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePartnerInfoModal;
