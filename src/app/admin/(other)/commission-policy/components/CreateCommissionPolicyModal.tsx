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
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import {
  createPartnerTierAPI,
  getAllPartnerTierAPI,
} from "@/src/services/partner-tier.service";
import { createCommissionPolicyAPI } from "@/src/services/commission-policy.service";
import { PartnerTier, ProductPriceSegment } from "@/src/types";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";

function CreateCommissionPolicyModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    partnerTierId: z.string().min(1, "Cấp độ đối tác là bắt buộc"),
    priceSegmentId: z.string().min(1, "Phân khúc giá là bắt buộc"),
    commissionRate: z
      .string()
      .min(1, "Tỷ lệ hoa hồng là bắt buộc")
      .refine((val) => !isNaN(Number(val)), "Tỷ lệ hoa hồng phải là số")
      .refine(
        (val) => Number(val) >= 0 && Number(val) <= 100,
        "Tỷ lệ hoa hồng phải từ 0 đến 100",
      ),
    effectiveDate: z.string(),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerTierId: "",
      priceSegmentId: "",
      commissionRate: "",
      effectiveDate: "",
    },
  });

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

  const partnerTierOptions = partnerTierList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const priceSegmentOptions = priceSegmentList.map((s) => ({
    value: s.id,
    label: `${s.name} ( ${s.minPrice.toLocaleString("vi-VN")}đ - ${s.maxPrice.toLocaleString("vi-VN")}đ )`,
  }));

  async function onSubmit(data: z.output<typeof formSchema>) {
    console.log("create commission policy data", data);
    const payload = {
      ...data,
      commissionRate: Number(data.commissionRate) / 100,
      effectiveDate: data.effectiveDate
        ? new Date(data.effectiveDate).toISOString()
        : null,
    };

    console.log("create commission policy payload", payload);

    try {
      await createCommissionPolicyAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["commissionPolicies"],
      });

      form.reset();
      toast.success("Thêm cấp độ đối tác mới thành công");

      setOpen(false);
    } catch (error) {
      console.log("create commission policy err", error);
      toast.error("Thêm cấp độ đối tác mới thất bại");
    }
  }

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
          <Plus /> Thêm chính sách hoa hồng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm chính sách hoa hồng</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mb-2"
            id="form-create-partner-tier"
          >
            <FormFieldCustom
              name="partnerTierId"
              label="Cấp độ đối tác"
              placeholder="Chọn cấp độ đối tác"
              type="select"
              selectData={partnerTierOptions}
            />

            <FormFieldCustom
              name={`priceSegmentId`}
              label="Phân giá sản phẩm"
              type="select"
              selectData={priceSegmentOptions}
            />

            <FormFieldCustom
              name="commissionRate"
              label="Tỷ lệ hoa hồng (%)"
              placeholder="Ví dụ: 10"
            />

            <FormFieldCustom
              name="effectiveDate"
              label="Ngày hiệu lực"
              type="date"
              placeholder="Ví dụ: 2024-01-01"
            />
          </form>
        </FormProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button type="submit" form="form-create-partner-tier">
            Thêm mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCommissionPolicyModal;
