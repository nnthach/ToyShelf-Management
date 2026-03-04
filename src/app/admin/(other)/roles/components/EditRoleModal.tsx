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
} from "@/src/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { getRoleDetailAPI, updateRoleAPI } from "@/src/services/role.service";

type EditRoleModalProps = {
  roleId: string;
  isOpen: boolean;
  onClose: () => void;
};

function EditRoleModal({ roleId, isOpen, onClose }: EditRoleModalProps) {
  const queryClient = useQueryClient();

  const { data: roleDetail, isLoading } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => getRoleDetailAPI(roleId!),
    select: (res) => res.data,
    enabled: !!roleId,
  });

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

  useEffect(() => {
    if (roleDetail) {
      form.reset({
        name: roleDetail.name,
        description: roleDetail.description,
      });
    }
  }, [roleDetail, form]);

  async function onSubmit(data: z.input<typeof formSchema>) {
    try {
      await updateRoleAPI(data, roleId);

      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["role", roleId],
      });

      form.reset();
      toast.success("Chỉnh sửa cấp độ vai trò thành công");
      onClose();
    } catch (error) {
      console.log("update role err", error);
      toast.error("Chỉnh sửa cấp độ vai trò thất bại");
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
            <DialogTitle>Chỉnh sửa vai trò</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mb-2"
              id="form-edit-role"
            >
              <FormFieldCustom
                name="name"
                label="Tên cấp độ vai trò"
                placeholder="Ví dụ: Cấp độ 1"
              />
              <FormFieldCustom
                name="description"
                label="Mô tả cấp độ vai trò"
                placeholder="Ví dụ: Mô tả cấp độ 1"
              />
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" form="form-edit-role">
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EditRoleModal;
