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
import { createRoleAPI } from "@/src/services/role.service";

function CreateRoleModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Tên cấp độ vai trò là bắt buộc"),
    description: z.string().min(1, "Mô tả cấp độ vai trò là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: z.output<typeof formSchema>) {
    console.log("create role data", data);
    try {
      await createRoleAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      form.reset();
      toast.success("Thêm cấp độ vai trò mới thành công");

      setOpen(false);
    } catch (error) {
      console.log("create role err", error);
      toast.error("Thêm cấp độ vai trò mới thất bại");
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
          <Plus /> Thêm cấp độ vai trò
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm cấp độ vai trò</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mb-2"
            id="form-create-role"
          >
            <FormFieldCustom
              name="name"
              label="Tên cấp độ vai trò"
              placeholder="Ví dụ: Cấp độ 1"
            />

            <FormFieldCustom
              name="description"
              label="Mô tả cấp độ vai trò"
              placeholder="Ví dụ: 1"
            />
          </form>
        </FormProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button type="submit" form="form-create-role">
            Thêm mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoleModal;
