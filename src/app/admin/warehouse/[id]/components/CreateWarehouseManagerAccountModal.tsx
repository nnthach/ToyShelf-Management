"use client";
import { createAllRoleAccountAPI } from "@/src/services/account.service";
import { getAllRoleAPI } from "@/src/services/role.service";
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
import { Role } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Mail, Plus, Send, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

function CreateWarehouseManagerAccountModal({
  warehouseId,
}: {
  warehouseId: string;
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    email: z.string().min(1, "Email là bắt buộc"),
    fullName: z.string().min(1, "Tên đối tác là bắt buộc"),
    roleIds: z.array(z.string()).optional(),
    warehouseId: z.string().min(1, "Kho là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      roleIds: [],
      warehouseId: warehouseId,
    },
  });

  const { data: roleList = [] } = useQuery({
    queryKey: ["roles", { isActive: undefined }],
    queryFn: () => getAllRoleAPI({ isActive: undefined }),
    select: (res) => res.data as Role[],
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const warehouseRole = roleList.find((r) => r.name === "Warehouse");

    const payload = {
      ...data,
      roleIds: warehouseRole ? [warehouseRole.id] : [],
    };

    try {
      await createAllRoleAccountAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["warehouse"],
      });

      form.reset();
      toast.success("Tạo đối tác thành công");

      setOpen(false);
    } catch (error) {
      toast.error("Tạo đối tác thất bại");
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
          <Plus /> Thêm tài khoản quản lý kho
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header với Background nhẹ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={22} />
            Thêm tài khoản quản lý
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1 mt-0.5">
            <Info size={14} /> Cấp quyền truy cập hệ thống cho quản lý kho mới.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-partner-account"
            >
              <div className="grid gap-4">
                <FormFieldCustom
                  name="fullName"
                  label="Họ và tên"
                  icon={<User size={18} />}
                  placeholder="Nhập tên người quản lý..."
                />

                <FormFieldCustom
                  name="email"
                  label="Email đăng nhập"
                  icon={<Mail size={18} />}
                  placeholder="example@gmail.com"
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
            form="form-create-partner-account"
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

export default CreateWarehouseManagerAccountModal;
