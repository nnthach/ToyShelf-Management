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
import { Edit, FileText, ShieldCheck, Sparkles } from "lucide-react";

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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ: Sạch sẽ & Hiện đại */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Chỉnh sửa cấp bậc vai trò
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-indigo-500" />
            Xác định các tầng quyền hạn cho người dùng trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body: Thoáng & Dễ quét thông tin */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-role"
            >
              {/* TÊN CẤP BẬC VAI TRÒ */}
              <FormFieldCustom
                name="name"
                label="Tên cấp bậc vai trò"
                placeholder="Ví dụ: Quản trị viên cao cấp, Nhân viên..."
                icon={<ShieldCheck size={18} />}
              />

              {/* MÔ TẢ */}
              <FormFieldCustom
                name="description"
                label="Mô tả cấp độ"
                placeholder="Mô tả ngắn gọn về phạm vi quyền hạn của cấp bậc này..."
                type="textarea"
                className="min-h-[100px]"
                icon={<FileText size={18} />}
              />
            </form>
          </FormProvider>
        </div>

        {/* Footer đồng bộ: Background nhạt & Button tràn viền */}
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
            form="form-create-role"
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

export default EditRoleModal;
