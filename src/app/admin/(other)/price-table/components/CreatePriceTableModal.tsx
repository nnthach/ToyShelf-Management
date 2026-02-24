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
import { Plus } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import {
  createPartnerTierAPI,
  getAllPartnerTierAPI,
} from "@/src/services/partner-tier.service";
import { createPriceTableAPI } from "@/src/services/price-table.service";
import { PriceTableType } from "@/src/enums/price-table-type.enum";
import { PartnerTier, ProductPriceSegment } from "@/src/types";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";

function CreatePriceTableModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data: partnerTierList = [], isLoading } = useQuery({
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
      items: [
        {
          priceSegmentId: "",
          commissionRate: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(data: z.output<typeof formSchema>) {
    console.log("create price table data", data);

    const payload = {
      ...data,
      items: data.items.map((i) => ({
        ...i,
        commissionRate: Number(i.commissionRate),
      })),
    };
    try {
      await createPriceTableAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["priceTables"],
      });

      form.reset();
      toast.success("Thêm bảng giá mới thành công");

      setOpen(false);
    } catch (error) {
      console.log("create price table err", error);
      toast.error("Thêm bảng giá mới thất bại");
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
          <Plus /> Thêm bảng giá hoa hồng đối tác
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Thêm bảng giá hoa hồng đối tác</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4"
            id="form-create-price-table"
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
          <Button type="submit" form="form-create-price-table">
            Tạo mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePriceTableModal;
