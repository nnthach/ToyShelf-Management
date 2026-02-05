"use client";
import { PARTNER_LEVEL_OPTIONS } from "@/src/constants/partner-level";
import { PartnerFormValues, partnerSchema } from "@/src/schemas/partner.schema";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
      tier: "",
      revenueSharePercent: 0,
    },
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
      console.log("create partner err", error);
      toast.error("Tạo đối tác thất bại");
    }
  }

  const partnerLevelOption = PARTNER_LEVEL_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const revenueOption = [
    { value: 5, label: "5%" },
    { value: 10, label: "10%" },
    { value: 15, label: "15%" },
  ];

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
      <form>
        <DialogTrigger asChild>
          <Button className="btn-primary-gradient">
            <Plus /> Thêm đối tác
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm đối tác mới</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-create-partner"
            >
              <div className="grid grid-cols-2 gap-3">
                <FormFieldCustom
                  name="companyName"
                  label="Tên công ty"
                  placeholder="Tên công ty"
                />
                <FormFieldCustom
                  name="tier"
                  label="Cấp bậc"
                  placeholder="Chọn cấp bậc"
                  type="select"
                  selectData={partnerLevelOption}
                />
              </div>
              <FormFieldCustom
                name="revenueSharePercent"
                label="Tỷ lệ chia sẻ doanh thu"
                placeholder="Chọn tỷ lệ chia sẻ doanh thu"
                type="select"
                selectData={revenueOption}
              />
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form="form-create-partner"
              // disabled={createPartnerMutation.isPending}
            >
              Tạo đối tác
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreatePartnerModal;
