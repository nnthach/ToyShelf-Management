"use client";
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
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import {
  getAllPartnerTierAPI,
  updatePartnerTierAPI,
} from "@/src/services/partner-tier.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import {
  getPriceTableDetailAPI,
  updatePriceTableAPI,
} from "@/src/services/price-table.service";
import { PartnerTier, PriceTableItem, ProductPriceSegment } from "@/src/types";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";
import { PriceTableType } from "@/src/enums/price-table-type.enum";
import {
  ClipboardList,
  Edit,
  FileSpreadsheet,
  Layers,
  Percent,
  Plus,
  Sparkles,
  Trash2,
  UserCheck,
} from "lucide-react";

type EditPriceTableModalProps = {
  priceTableId: string;
  isOpen: boolean;
  onClose: () => void;
};

function EditPriceTableModal({
  priceTableId,
  isOpen,
  onClose,
}: EditPriceTableModalProps) {
  const queryClient = useQueryClient();

  const { data: priceTableDetail, isLoading } = useQuery({
    queryKey: ["priceTable", priceTableId],
    queryFn: () => getPriceTableDetailAPI(priceTableId!),
    select: (res) => res.data,
    enabled: !!priceTableId,
  });

  const { data: partnerTierList = [], isLoading: isPartnerTierLoading } =
    useQuery({
      queryKey: ["partnerTiers", { isActive: undefined }],
      queryFn: () => getAllPartnerTierAPI({ isActive: undefined }),
      select: (res) => res.data as PartnerTier[],
    });

  const { data: priceSegmentList = [], isLoading: isPriceSegmentLoading } =
    useQuery({
      queryKey: ["priceSegments", { isActive: undefined }],
      queryFn: () => getAllProducePriceSegmentAPI({ isActive: undefined }),
      select: (res) => res.data as ProductPriceSegment[],
    });

  const formSchema = z.object({
    name: z.string().min(1, "Tên bảng là bắt buộc"),
    partnerTierId: z.string().min(1, "Cấp bậc đối tác là bắt buộc"),
    type: z.string().min(1, "Loại bảng giá là bắt buộc"),
    isActive: z.string(),
    items: z.array(
      z.object({
        priceSegmentId: z.string().min(1, "Cấp bậc sản phẩm là bắt buộc"),
        commissionRate: z
          .string()
          .min(1, "Phần trăm hoa hồng là bắt buộc")
          .refine((val) => !isNaN(Number(val)), "Phần trăm hoa hồng phải là số")
          .refine((val) => Number(val) >= 1, "Phần trăm hoa hồng phải >= 1"),
      }),
    ),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      partnerTierId: "",
      type: "",
      isActive: "true",
      items: [
        {
          priceSegmentId: "",
          commissionRate: "",
        },
      ],
    },
  });

  useEffect(() => {
    if (priceTableDetail) {
      form.reset({
        name: priceTableDetail.name,
        partnerTierId: priceTableDetail.partnerTierId,
        type: priceTableDetail.type.toUpperCase(),
        isActive: String(priceTableDetail.isActive),
        items: priceTableDetail.items.map((item: PriceTableItem) => ({
          priceSegmentId: item.priceSegmentId,
          commissionRate: item.commissionRate.toString(),
        })),
      });
    }
  }, [priceTableDetail, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...data,
        isActive: data.isActive === "true",
        type: data.type.charAt(0) + data.type.slice(1).toLowerCase(),
        items: data.items.map((item) => ({
          ...item,
          commissionRate: Number(item.commissionRate),
        })),
      };
      await updatePriceTableAPI(payload, priceTableId);

      queryClient.invalidateQueries({
        queryKey: ["priceTables"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["priceTable", priceTableId],
      });

      form.reset();
      toast.success("Chỉnh sửa bảng giá hoa hồng đối tác thành công");
      onClose();
    } catch (error) {
      toast.error("Chỉnh sửa bảng giá hoa hồng đối tác thất bại");
    }
  }

  const priceTableTypeOptions = Object.values(PriceTableType).map((value) => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase(),
  }));

  const partnerTierOptions = partnerTierList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const priceSegmentOptions = priceSegmentList.map((s) => ({
    value: s.id,
    label: `${s.name} ( ${s.minPrice.toLocaleString("vi-VN")}đ - ${s.maxPrice.toLocaleString("vi-VN")}đ )`,
  }));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Chỉnh sửa bảng giá hoa hồng đối tác
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-blue-500" />
            Thiết lập bảng giá chi tiết theo từng phân khúc sản phẩm cho đối
            tác.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body - Grid 2 cột */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              id="form-create-price-table"
            >
              {/* CỘT TRÁI: THÔNG TIN CHUNG */}
              <div className="space-y-5 col-span-1">
                <div className="pb-2 border-b border-dashed">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Thông tin cơ bản
                  </h3>
                </div>

                <FormFieldCustom
                  name="name"
                  label="Tên bảng giá"
                  placeholder="Ví dụ: Bảng giá đại lý cấp 1"
                  icon={<ClipboardList size={18} />}
                />

                <FormFieldCustom
                  name="type"
                  label="Loại bảng giá"
                  placeholder="Chọn loại"
                  type="select"
                  selectData={priceTableTypeOptions}
                  icon={<FileSpreadsheet size={18} />}
                />

                <FormFieldCustom
                  name="partnerTierId"
                  label="Cấp bậc đối tác"
                  placeholder="Chọn cấp bậc"
                  type="select"
                  selectData={partnerTierOptions}
                  icon={<UserCheck size={18} />}
                />
              </div>

              {/* CỘT PHẢI: CHI TIẾT HOA HỒNG */}
              <div className="space-y-4 col-span-2">
                <div className="pb-2 border-b border-dashed flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Cấu hình hoa hồng
                  </h3>
                  <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                    {fields.length} Hạng mục
                  </span>
                </div>

                <div className="space-y-4 max-h-[400px] pr-2 overflow-y-auto custom-scrollbar">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="group relative border rounded-xl p-4 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormFieldCustom
                          name={`items.${index}.priceSegmentId`}
                          label="Phân giá sản phẩm"
                          type="select"
                          placeholder="Chọn phân giá"
                          selectData={priceSegmentOptions}
                          icon={<Layers size={16} />}
                        />

                        <FormFieldCustom
                          name={`items.${index}.commissionRate`}
                          label="Hoa hồng (%)"
                          placeholder="Ví dụ: 10"
                          type="number"
                          icon={<Percent size={16} />}
                        />
                      </div>

                      {/* Nút xóa item ở góc */}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-red-500 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-2 py-6 hover:bg-slate-50 hover:border-primary/50 text-slate-500 hover:text-primary transition-all gap-2"
                  onClick={() =>
                    append({ priceSegmentId: "", commissionRate: "" })
                  }
                >
                  <Plus size={18} />
                  Thêm hạng mục hoa hồng
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer đồng bộ */}
        <DialogFooter className="p-4 bg-slate-50/50 border-t flex gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 font-medium text-slate-600 hover:bg-slate-200"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-create-price-table"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
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

export default EditPriceTableModal;
