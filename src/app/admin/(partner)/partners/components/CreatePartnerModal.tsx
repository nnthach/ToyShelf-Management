"use client";
import { PartnerFormValues, partnerSchema } from "@/src/schemas/partner.schema";
import { getAllPartnerTierAPI } from "@/src/services/partner-tier.service";
import { createPartnerAPI } from "@/src/services/partner.service";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
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
import { PartnerTier } from "@/src/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Info,
  Plus,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

function CreatePartnerModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      companyName: "",
      partnerTierId: "",
    },
  });

  const { data: partnerTierList = [], isLoading } = useQuery({
    queryKey: ["partnerTiers", { isActive: undefined }],
    queryFn: () => getAllPartnerTierAPI({ isActive: undefined }),
    select: (res) => res.data as PartnerTier[],
  });

  async function onSubmit(data: PartnerFormValues) {
    try {
      await createPartnerAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["partners"],
      });

      form.reset();
      toast.success("Tạo đối tác thành công");

      setOpen(false);
    } catch (error) {
      toast.error("Tạo đối tác thất bại");
    }
  }

  const partnerTierOptions = partnerTierList.map((s) => ({
    value: s.id,
    label: s.name,
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
          <Plus /> Thêm đối tác
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header với Background nhẹ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800">
            Thêm đối tác mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1 mt-0.5">
            <Info size={14} /> Điền thông tin để thiết lập quan hệ đối tác mới.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-partner"
            >
              <div className="grid gap-4">
                <FormFieldCustom
                  name="companyName"
                  label="Tên công ty"
                  icon={<Building2 size={18} />}
                  placeholder="Nhập tên chính thức của doanh nghiệp..."
                />

                <FormFieldCustom
                  name="partnerTierId"
                  label="Phân cấp đối tác"
                  icon={<ShieldCheck size={18} />}
                  placeholder="Chọn hạng mức hợp tác"
                  type="select"
                  selectData={partnerTierOptions}
                />
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer với style sạch sẽ */}
        <DialogFooter className="p-6 bg-slate-50/50 border-t flex gap-3 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 sm:flex-none font-medium text-slate-600 hover:bg-slate-200"
            >
              Hủy bỏ
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-create-partner"
            className="flex-1 sm:flex-none min-w-[120px] gap-2 font-bold shadow-sm"
            variant="success"
          >
            <Send className="h-4 w-4" />
            Xác nhận tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePartnerModal;
