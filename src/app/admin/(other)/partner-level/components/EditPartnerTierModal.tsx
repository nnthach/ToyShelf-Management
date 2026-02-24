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
  getPartnerTierDetailAPI,
  updatePartnerTierAPI,
} from "@/src/services/partner-tier.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";

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
    priority: z
      .string()
      .min(1, "Giá tối thiểu là bắt buộc")
      .refine((val) => !isNaN(Number(val)), "Giá tối thiểu phải là số")
      .refine((val) => Number(val) >= 1, "Giá tối thiểu phải >= 1"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      priority: "1",
    },
  });

  useEffect(() => {
    if (partnerTierDetail) {
      form.reset({
        name: partnerTierDetail.name,
        priority: partnerTierDetail.priority,
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
      toast.success("Chỉnh sửa cấp độ đối tác thành công");
      onClose();
    } catch (error) {
      console.log("update partner tier err", error);
      toast.error("Chỉnh sửa cấp độ đối tác thất bại");
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
            <DialogTitle>Chỉnh sửa cấp độ đối tác</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mb-2"
              id="form-edit-partner-tier"
            >
              <FormFieldCustom
                name="name"
                label="Tên cấp độ đối tác"
                placeholder="Ví dụ: Cấp độ 1"
              />
              <FormFieldCustom
                name="priority"
                label="Ưu tiên"
                placeholder="Ví dụ: 1"
                type="number"
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

export default EditPartnerTierModal;
