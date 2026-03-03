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
    partnerTierId: z.string().min(1, "Cấp độ đối tác là bắt buộc"),
    type: z.string().min(1, "Loại bảng giá là bắt buộc"),
    isActive: z.string(),
    items: z.array(
      z.object({
        priceSegmentId: z.string().min(1, "Cấp độ sản phẩm là bắt buộc"),
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
      console.log("update price table err", error);
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
      <form>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bảng giá hoa hồng đối tác</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4"
              id="form-edit-partner-tier"
            >
              <div className="space-y-4 col-span-1">
                <FormFieldCustom
                  name="name"
                  label="Tên bảng giá"
                  placeholder="Ví dụ: Bảng giá cấp độ 1"
                />

                <FormFieldCustom
                  name="type"
                  label="Loại bảng giá"
                  placeholder="Chọn loại bảng giá"
                  type="select"
                  selectData={priceTableTypeOptions}
                />

                <FormFieldCustom
                  name="partnerTierId"
                  label="Cấp độ đối tác"
                  placeholder="Chọn cấp độ đối tác"
                  type="select"
                  selectData={partnerTierOptions}
                />

                <FormFieldCustom
                  name="isActive"
                  label="Trạng thái"
                  placeholder="Chọn trạng thái"
                  type="select"
                  selectData={[
                    { value: "true", label: "Kích hoạt" },
                    { value: "false", label: "Không kích hoạt" },
                  ]}
                />
              </div>

              <div className="space-y-4 col-span-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="border p-3 rounded-md">
                    <div className="flex gap-2">
                      <FormFieldCustom
                        name={`items.${index}.priceSegmentId`}
                        label="Phân giá sản phẩm"
                        type="select"
                        selectData={priceSegmentOptions}
                      />

                      <FormFieldCustom
                        name={`items.${index}.commissionRate`}
                        label="Phần trăm hoa hồng"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm mt-2"
                    >
                      Xóa
                    </button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() =>
                    append({
                      priceSegmentId: "",
                      commissionRate: "",
                    })
                  }
                >
                  Thêm
                </Button>
              </div>
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" form="form-edit-partner-tier">
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EditPriceTableModal;
