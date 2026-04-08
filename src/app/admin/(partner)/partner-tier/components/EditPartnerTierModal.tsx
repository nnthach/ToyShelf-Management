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
import { Edit, Hash, Layers, Plus, Send, Sparkles, Trophy } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import {
  getPartnerTierDetailAPI,
  updatePartnerTierAPI,
} from "@/src/services/partner-tier.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

type EditPartnerTierModalProps = {
  tierId: string;
  isOpen: boolean;
  onClose: () => void;
};

function EditPartnerTierModal({
  tierId,
  isOpen,
  onClose,
}: EditPartnerTierModalProps) {
  const queryClient = useQueryClient();

  const { data: partnerTierDetail, isLoading } = useQuery({
    queryKey: ["partnerTier", tierId],
    queryFn: () => getPartnerTierDetailAPI(tierId!),
    select: (res) => res.data,
    enabled: !!tierId,
  });

  const formSchema = z.object({
    name: z.string().min(1, "Tên cấp độ đối tác là bắt buộc"),
    priority: z.number().min(1, "Hãy nhập độ ưu tiên"),
    maxShelvesPerStore: z.number().min(1, "Hãy nhập số lượng kệ tối đa"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      priority: 1,
      maxShelvesPerStore: 1,
    },
  });

  useEffect(() => {
    if (partnerTierDetail) {
      form.reset({
        name: partnerTierDetail.name,
        priority: partnerTierDetail.priority || 1,
        maxShelvesPerStore: partnerTierDetail.maxShelvesPerStore || 1,
      });
    }
  }, [partnerTierDetail, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updatePartnerTierAPI(data, tierId);

      queryClient.invalidateQueries({
        queryKey: ["partnerTiers"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["partnerTier", tierId],
      });

      form.reset();
      toast.success("Chỉnh sửa cấp bậc đối tác thành công");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Chỉnh sửa cấp bậc đối tác thất bại"));
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header với Icon khối đặc trưng */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800">
            Chỉnh sửa bậc đối tác
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} />
            Chỉnh sửa thứ hạng và quyền ưu tiên cho đối tác.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body - Tăng khoảng cách để thoáng hơn */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-partner-tier"
            >
              <FormFieldCustom
                name="name"
                label="Tên cấp bậc đối tác"
                placeholder="Ví dụ: Vàng, Bạch Kim..."
                icon={<Trophy size={18} />}
                required
              />

              <FormFieldCustom
                name="priority"
                label="Mức độ ưu tiên"
                labelNote="Số càng nhỏ ưu tiên càng cao"
                placeholder="Ví dụ: 1"
                type="number"
                icon={<Hash size={18} />}
                required
              />
              <FormFieldCustom
                name="maxShelvesPerStore"
                label="Số lượng kệ tối đa ở mỗi cửa hàng"
                placeholder="Ví dụ: 1"
                type="number"
                icon={<Layers size={18} />}
                required
              />
            </form>
          </FormProvider>
        </div>

        {/* Footer đồng bộ style */}
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
            form="form-create-partner-tier"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success" // Dùng variant success bạn đã thêm trong button.tsx
          >
            <Edit className="h-4 w-4" />
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditPartnerTierModal;
