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
  Calendar,
  Edit,
  Info,
  Layers,
  Percent,
  Plus,
  Send,
  Trophy,
} from "lucide-react";
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

import { PartnerTier, ProductPriceSegment } from "@/src/types";
import { getCommissionTableDetailAPI } from "@/src/services/commission-table.service";

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
    queryFn: () => getCommissionTableDetailAPI(commissionPolicyId!),
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
        commissionRate: (
          commissionPolicyDetail.commissionRate * 100
        ).toString(),
        effectiveDate: commissionPolicyDetail.effectiveDate
          ? commissionPolicyDetail.effectiveDate.split("T")[0]
          : "",
      });
    }
  }, [commissionPolicyDetail, form]);

  const { data: partnerTierList = [], isLoading: isPartnerTierLoading } =
    useQuery({
      queryKey: ["partnerTiers", { isActive: undefined }],
      queryFn: () => getAllPartnerTierAPI({ isActive: undefined }),
      select: (res) => res.data as PartnerTier[],
    });


  const partnerTierOptions = partnerTierList.map((s) => ({
    value: s.id,
    label: s.name,
  }));



  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      ...data,
      commissionRate: Number(data.commissionRate) / 100,
      effectiveDate: data.effectiveDate
        ? new Date(data.effectiveDate).toISOString()
        : null,
    };

    try {

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
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header tối giản */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Chỉnh sửa chính sách hoa hồng
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Info size={14} />
            Chỉnh sửa mức chiết khấu hoa hồng theo từng phân khúc sản phẩm.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="form-create-commission-policy"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <FormFieldCustom
                    name="partnerTierId"
                    label="Cấp bậc đối tác"
                    placeholder="Chọn cấp bậc"
                    type="select"
                    selectData={partnerTierOptions}
                    icon={<Trophy size={16} />}
                  />
                </div>



                <div className="col-span-2 sm:col-span-1">
                  <FormFieldCustom
                    name="commissionRate"
                    label="Tỷ lệ hoa hồng (%)"
                    placeholder="Ví dụ: 10"
                    type="number"
                    icon={<Percent size={16} />}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <FormFieldCustom
                    name="effectiveDate"
                    label="Ngày hiệu lực"
                    type="date"
                    icon={<Calendar size={16} />}
                  />
                </div>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
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
            form="form-create-commission-policy"
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

export default EditCommissionPolicyModal;
