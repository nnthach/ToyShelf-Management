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
import {
  getAllPartnerTierAPI,
  updatePartnerTierAPI,
} from "@/src/services/partner-tier.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import {
  getCommissionPolicyDetailAPI,
  updateCommissionPolicyAPI,
} from "@/src/services/commission-policy.service";
import { PartnerTier, ProductPriceSegment } from "@/src/types";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";

type EditCommissionPolicyModalProps = {
  commissionPolicyId: string;
  isOpen: boolean;
  onClose: () => void;
};

function EditCommissionPolicyModal({
  commissionPolicyId,
  isOpen,
  onClose,
}: EditCommissionPolicyModalProps) {
  const queryClient = useQueryClient();

  const { data: commissionPolicyDetail, isLoading } = useQuery({
    queryKey: ["commissionPolicy", commissionPolicyId],
    queryFn: () => getCommissionPolicyDetailAPI(commissionPolicyId!),
    select: (res) => res.data,
    enabled: !!commissionPolicyId,
  });

  const formSchema = z.object({
    partnerTierId: z.string().min(1, "Cấp bậc đối tác là bắt buộc"),
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

  useEffect(() => {
    if (commissionPolicyDetail) {
      form.reset({
        partnerTierId: commissionPolicyDetail.partnerTierId,
        priceSegmentId: commissionPolicyDetail.priceSegmentId,
        commissionRate: commissionPolicyDetail.commissionRate.toString(),
        effectiveDate: commissionPolicyDetail.effectiveDate,
      });
    }
  }, [commissionPolicyDetail, form]);

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

  const partnerTierOptions = partnerTierList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const priceSegmentOptions = priceSegmentList.map((s) => ({
    value: s.id,
    label: `${s.name} ( ${s.minPrice.toLocaleString("vi-VN")}đ - ${s.maxPrice.toLocaleString("vi-VN")}đ )`,
  }));

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("update commission policy data", data);
    const payload = {
      ...data,
      commissionRate: Number(data.commissionRate) / 100,
      effectiveDate: data.effectiveDate
        ? new Date(data.effectiveDate).toISOString()
        : null,
    };

    console.log("update commission policy payload", payload);
    try {
      await updateCommissionPolicyAPI(payload, commissionPolicyId);

      queryClient.invalidateQueries({
        queryKey: ["commissionPolicies"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["commissionPolicy", commissionPolicyId],
      });

      form.reset();
      toast.success("Chỉnh sửa chính sách hoa hồng thành công");
      onClose();
    } catch (error) {
      console.log("update commission policy err", error);
      toast.error("Chỉnh sửa chính sách hoa hồng thất bại");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa cấp bậc đối tác</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
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
                label="Cấp bậc đối tác"
                placeholder="Chọn cấp bậc đối tác"
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
            <Button type="submit" form="form-edit-partner-tier">
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EditCommissionPolicyModal;
