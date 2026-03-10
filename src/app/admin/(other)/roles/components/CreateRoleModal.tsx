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
  FileText,
  Plus,
  PlusCircle,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
    name: z.string().min(1, "Tên cấp bậc vai trò là bắt buộc"),
    description: z.string().min(1, "Mô tả cấp bậc vai trò là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: z.output<typeof formSchema>) {
    try {
      await createRoleAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      form.reset();
      toast.success("Thêm cấp bậc vai trò mới thành công");

      setOpen(false);
    } catch (error) {
      toast.error("Thêm cấp bậc vai trò mới thất bại");
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
          <Plus /> Thêm cấp bậc vai trò
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ: Sạch sẽ & Hiện đại */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Thêm cấp bậc vai trò
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
            <Send className="h-4 w-4" />
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoleModal;
