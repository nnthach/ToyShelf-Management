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
      items: data.items.map((item) => ({
        productCategoryIds: item.selectedCategoryIds, // Đã là mảng nên gán trực tiếp
        commissionRate: Number(item.commissionRate) / 100,
      })),
    };

    try {
      await updateCommissionTableAPI(payload, commissionTableId);
      queryClient.invalidateQueries({ queryKey: ["commissionTables"] });
      toast.success("Thành công!");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Thất bại!");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Chỉnh sửa bảng hoa hồng
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b">
          <DialogTitle className="text-xl font-bold">
            Chỉnh sửa bảng hoa hồng
          </DialogTitle>
          <DialogDescription>
            Chọn danh mục sản phẩm và áp dụng mức hoa hồng tương ứng.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[75vh] overflow-y-auto bg-white">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="form-create-price"
              className="grid grid-cols-12 gap-8"
            >
              {/* CỘT TRÁI: INFO CHUNG */}
              <div className="col-span-4 space-y-4 border-r pr-6">
                {/* ... (giữ nguyên FormFieldCustom cho name, type, partnerTierId) */}
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">
                  Thông tin chung
                </h3>
                <FormFieldCustom
                  name="name"
                  label="Tên bảng giá"
                  icon={<ClipboardList size={18} />}
                />
                <FormFieldCustom
                  name="type"
                  label="Loại"
                  type="select"
                  selectData={Object.values(PriceTableType).map((v) => ({
                    value: v,
                    label: v,
                  }))}
                />
                <FormFieldCustom
                  name="partnerTierId"
                  label="Cấp đối tác"
                  type="select"
                  selectData={partnerTierList.map((t) => ({
                    value: t.id,
                    label: t.name,
                  }))}
                />
              </div>

              {/* CỘT PHẢI: DANH SÁCH HẠNG MỤC */}
              <div className="col-span-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">
                    Cấu hình chi tiết
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      append({ selectedCategoryIds: [], commissionRate: 0 })
                    }
                  >
                    <Plus size={14} className="mr-1" /> Thêm dòng
                  </Button>
                </div>

                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative p-5 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:shadow-md"
                    >
                      <div className="mb-4">
                        <label className="text-sm font-medium text-slate-600 mb-3 block">
                          Chọn các danh mục áp dụng:
                        </label>
                        <Controller
                          control={form.control}
                          name={`items.${index}.selectedCategoryIds`}
                          render={({ field: { value = [], onChange } }) => {
                            const unavailableIds = getUnavailableIds(index); // Lấy IDs từ các dòng khác

                            return (
                              <div className="flex flex-wrap gap-2">
                                {productCategoryList.map((cat) => {
                                  const isSelected = value.includes(cat.id);
                                  const isDisabled = unavailableIds.includes(
                                    cat.id,
                                  ); // Đã chọn ở dòng khác

                                  return (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      disabled={isDisabled} // Ngăn click
                                      onClick={() => {
                                        const newValue = isSelected
                                          ? value.filter(
                                              (id: string) => id !== cat.id,
                                            )
                                          : [...value, cat.id];
                                        onChange(newValue);
                                      }}
                                      className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 border",
                                        isSelected
                                          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                          : isDisabled
                                            ? "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed opacity-50" // Style cho nút bị disable
                                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-500",
                                      )}
                                    >
                                      {isSelected && <Check size={12} />}
                                      {cat.name}
                                    </button>
                                  );
                                })}
                              </div>
                            );
                          }}
                        />
                      </div>

                      <div className="w-1/3">
                        <FormFieldCustom
                          name={`items.${index}.commissionRate`}
                          label="Mức hoa hồng (%)"
                          type="number"
                          placeholder="10"
                          icon={<Percent size={14} />}
                        />
                      </div>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>

        <DialogFooter className="p-4 bg-slate-50 border-t">
          <DialogClose asChild>
            <Button variant="ghost">Hủy</Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-create-price"
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
