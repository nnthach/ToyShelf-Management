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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { createPartnerTierAPI } from "@/src/services/partner-tier.service";

function CreatePartnerTierModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Tên cấp độ đối tác là bắt buộc"),
    priority: z
      .string()
      .min(1, "Ưu tiên là bắt buộc")
      .refine((val) => !isNaN(Number(val)), "Ưu tiên phải là số")
      .refine((val) => Number(val) >= 1, "Ưu tiên phải >= 1"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      priority: "1",
    },
  });

  async function onSubmit(data: z.output<typeof formSchema>) {
    console.log("create partner tier data", data);
    try {
      await createPartnerTierAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["partnerTiers"],
      });

      form.reset();
      toast.success("Thêm cấp độ đối tác mới thành công");

      setOpen(false);
    } catch (error) {
      console.log("create partner tier err", error);
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
          <Plus /> Thêm cấp độ đối tác
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm cấp độ đối tác</DialogTitle>
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
              name="name"
              label="Tên cấp độ đối tác"
              placeholder="Ví dụ: Cấp độ 1"
            />

            <FormFieldCustom
              name="priority"
              label="Ưu tiên"
              placeholder="Ví dụ: 1"
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

export default CreatePartnerTierModal;
