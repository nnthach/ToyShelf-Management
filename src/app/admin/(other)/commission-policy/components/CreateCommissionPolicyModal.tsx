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
  Info,
  Layers,
  Percent,
  Plus,
  Send,
  Trophy,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { getAllPartnerTierAPI } from "@/src/services/partner-tier.service";
import { createCommissionPolicyAPI } from "@/src/services/commission-policy.service";
import { PartnerTier, ProductPriceSegment } from "@/src/types";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";

function CreateCommissionPolicyModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

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
      toast.success("Thêm cấp bậc đối tác mới thành công");

      setOpen(false);
    } catch (error) {
      console.log("create commission policy err", error);
      toast.error("Thêm cấp bậc đối tác mới thất bại");
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
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header tối giản */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Thêm chính sách hoa hồng
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Info size={14} />
            Thiết lập mức chiết khấu hoa hồng theo từng phân khúc sản phẩm.
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
                    name="priceSegmentId"
                    label="Phân giá sản phẩm"
                    type="select"
                    placeholder="Chọn phân giá"
                    selectData={priceSegmentOptions}
                    icon={<Layers size={16} />}
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
            <Send className="h-4 w-4" />
            Xác nhận thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCommissionPolicyModal;
