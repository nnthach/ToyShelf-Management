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
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import z from "zod";
import { getAllPartnerTierAPI } from "@/src/services/partner-tier.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";

import { PriceTableType } from "@/src/enums/price-table-type.enum";
import {
  Check,
  ClipboardList,
  Percent,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { CommissionTableItem, PartnerTier, ProductCategory } from "@/src/types";
import {
  getCommissionTableDetailAPI,
  updateCommissionTableAPI,
} from "@/src/services/commission-table.service";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";
import { cn } from "@/src/styles/lib/utils";
import { formatCommissionTableTypeToVN } from "@/src/utils/format";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

type EditPriceTableModalProps = {
  commissionTableId: string;
  isOpen: boolean;
  onClose: () => void;
};

function EditPriceTableModal({
  commissionTableId,
  isOpen,
  onClose,
}: EditPriceTableModalProps) {
  const queryClient = useQueryClient();

  const { data: commissionTableDetail, isLoading } = useQuery({
    queryKey: ["commissionTable", commissionTableId],
    queryFn: () => getCommissionTableDetailAPI(commissionTableId!),
    select: (res) => res.data,
    enabled: !!commissionTableId,
  });

  const { data: partnerTierList = [] } = useQuery({
    queryKey: ["partnerTiers"],
    queryFn: () => getAllPartnerTierAPI({ isActive: undefined }),
    select: (res) => res.data as PartnerTier[],
  });

  const { data: productCategoryList = [] } = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => getAllProductCategoryAPI({ isActive: undefined }),
    select: (res) => res.data as ProductCategory[],
  });

  const formSchema = z.object({
    name: z.string().min(1, "Tên bảng là bắt buộc"),
    partnerTierId: z.string().min(1, "Cấp bậc đối tác là bắt buộc"),
    type: z.string().min(1, "Loại bảng giá là bắt buộc"),
    items: z
      .array(
        z.object({
          selectedCategoryIds: z
            .array(z.string())
            .min(1, "Chọn ít nhất 1 danh mục"),
          commissionRate: z.coerce.number().min(0, "Nhập % hoa hồng"),
        }),
      )
      .superRefine((items, ctx) => {
        const allIds = items.flatMap((item) => item.selectedCategoryIds);
        const hasDuplicate = allIds.length !== new Set(allIds).size;

        if (hasDuplicate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Một danh mục không thể xuất hiện ở nhiều mức hoa hồng khác nhau",
            path: [0, "selectedCategoryIds"], // Trỏ lỗi về dòng đầu tiên hoặc hiện toast tổng quát
          });
        }
      }),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      partnerTierId: "",
      type: "",
      items: [{ selectedCategoryIds: [], commissionRate: 0 }],
    },
  });

  useEffect(() => {
    if (commissionTableDetail) {
      form.reset({
        name: commissionTableDetail.name,
        partnerTierId: commissionTableDetail.partnerTierId,
        type: commissionTableDetail.type.toUpperCase(),
        items: commissionTableDetail.items.map((item: CommissionTableItem) => ({
          selectedCategoryIds:
            item.appliedCategories?.map((cat: ProductCategory) => cat.id) || [],
          commissionRate: item.commissionRate * 100,
        })),
      });
    }
  }, [commissionTableDetail, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const watchItems = form.watch("items");

  const getUnavailableIds = (currentIndex: number) => {
    return watchItems.reduce((acc, item, idx) => {
      if (idx !== currentIndex && item.selectedCategoryIds) {
        return [...acc, ...item.selectedCategoryIds];
      }
      return acc;
    }, [] as string[]);
  };
  async function onSubmit(data: z.input<typeof formSchema>) {
    const payload = {
      name: data.name,
      partnerTierId: data.partnerTierId,
      type: data.type,
      isActive: true,
      items: data.items.map((item) => ({
        productCategoryIds: item.selectedCategoryIds, // Đã là mảng nên gán trực tiếp
        commissionRate: Number(item.commissionRate) / 100,
      })),
    };

    try {
      await updateCommissionTableAPI(payload, commissionTableId);
      queryClient.invalidateQueries({ queryKey: ["commissionTables"] });
      toast.success("Chỉnh sửa bảng hoa hồng thành công");
      form.reset();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Chỉnh sửa bảng hoa hồng thất bại"));
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b">
          <DialogTitle className="text-xl font-bold">
            Chỉnh sửa bảng hoa hồng
          </DialogTitle>
          <DialogDescription>
            Chọn danh mục sản phẩm và áp dụng mức hoa hồng tương ứng.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[60vh] overflow-y-auto bg-white">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="form-update-commission-table"
              className="max-w-4xl mx-auto space-y-10" // Căn giữa và tạo khoảng cách lớn giữa các section
            >
              {/* PHẦN 1: THÔNG TIN CHUNG */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                    <ClipboardList size={20} />
                  </div>
                  <h3 className="text-sm font-bold uppercase text-slate-600 tracking-widest">
                    Thông tin chung
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormFieldCustom
                    name="name"
                    label="Tên bảng giá"
                    placeholder="Nhập tên bảng giá..."
                    required
                  />
                  <FormFieldCustom
                    name="type"
                    label="Loại chính sách"
                    type="select"
                    selectData={Object.values(PriceTableType).map((v) => ({
                      value: v,
                      label: formatCommissionTableTypeToVN(v),
                    }))}
                    required
                  />
                  <FormFieldCustom
                    name="partnerTierId"
                    label="Cấp đối tác áp dụng"
                    type="select"
                    selectData={partnerTierList.map((t) => ({
                      value: t.id,
                      label: t.name,
                    }))}
                    required
                  />
                </div>
              </section>

              {/* PHẦN 2: CẤU HÌNH CHI TIẾT */}
              <section className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                      <Plus size={20} />
                    </div>
                    <h3 className="text-sm font-bold uppercase text-slate-600 tracking-widest">
                      Cấu hình hoa hồng theo danh mục
                    </h3>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() =>
                      append({ selectedCategoryIds: [], commissionRate: 0 })
                    }
                  >
                    <Plus size={14} className="mr-1" /> Thêm cấu hình
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm group transition-all hover:border-blue-200"
                    >
                      {/* Header của từng dòng cấu hình */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded">
                          DÒNG #{index + 1}
                        </span>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-6">
                        {/* Chọn danh mục */}
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-3 block">
                            Danh mục sản phẩm áp dụng{" "}
                            <span className="text-red-500 ml-0.5">*</span>
                          </label>
                          <Controller
                            control={form.control}
                            name={`items.${index}.selectedCategoryIds`}
                            render={({ field: { value = [], onChange } }) => {
                              const unavailableIds = getUnavailableIds(index);
                              return (
                                <div className="flex flex-wrap gap-2">
                                  {productCategoryList.map((cat) => {
                                    const isSelected = value.includes(cat.id);
                                    const isDisabled = unavailableIds.includes(
                                      cat.id,
                                    );

                                    return (
                                      <button
                                        key={cat.id}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => {
                                          const newValue = isSelected
                                            ? value.filter(
                                                (id: string) => id !== cat.id,
                                              )
                                            : [...value, cat.id];
                                          onChange(newValue);
                                        }}
                                        className={cn(
                                          "px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border",
                                          isSelected
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                                            : isDisabled
                                              ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                                              : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-sm",
                                        )}
                                      >
                                        {isSelected ? (
                                          <Check size={14} />
                                        ) : (
                                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        )}
                                        {cat.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            }}
                          />
                        </div>

                        {/* Nhập hoa hồng */}
                        <div className="max-w-[240px]">
                          <FormFieldCustom
                            name={`items.${index}.commissionRate`}
                            label="Tỷ lệ hoa hồng (%)"
                            type="number"
                            placeholder="Ví dụ: 10"
                            icon={<Percent size={14} />}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </form>
          </FormProvider>
        </div>

        <DialogFooter className="p-4 bg-slate-50 border-t">
          <DialogClose asChild>
            <Button variant="ghost">Hủy</Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-update-commission-table"
            variant="success"
            className="px-8"
          >
            <Send className="mr-2 h-4 w-4" /> Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditPriceTableModal;
