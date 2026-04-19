import {
  createAllRoleAccountAPI,
  createWarehouseStaffAccountAPI,
} from "@/src/services/account.service";
import { getAllRoleAPI } from "@/src/services/role.service";
import { getAllWarehouseAPI } from "@/src/services/warehouse.service";
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
import { Warehouse } from "@/src/types";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Info,
  Mail,
  Plus,
  Send,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

function CreateStaffModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    email: z.string().min(1, "Email là bắt buộc"),
    fullName: z.string().min(1, "Tên đối tác là bắt buộc"),
    role: z.string().min(1, "Chức vụ là bắt buộc"),
    warehouseId: z.string().min(1, "Kho là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      role: "",
      warehouseId: "",
    },
  });

  const { data: warehouseList = [] } = useQuery({
    queryKey: ["warehouses", { isActive: undefined }],
    queryFn: () => getAllWarehouseAPI({ isActive: undefined }),
    select: (res) => res.data as Warehouse[],
  });

  const warehouseOptions = warehouseList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const roleOptions = [
    {
      value: "Manager",
      label: "Quán lý kho",
    },
    {
      value: "Shipper",
      label: "Nhân viên giao hàng",
    },
  ];

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await createWarehouseStaffAccountAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["staffs"],
      });

      form.reset();
      setOpen(false);
      toast.success("Tạo nhân viên thành công");
    } catch (error) {
      toast.error(getErrorMessage(error, "Tạo nhân viên thất bại"));
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
          <Plus /> Thêm nhân viên
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header với Background nhẹ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={22} />
            Thêm tài khoản nhân viên
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1 mt-0.5">
            <Info size={14} /> Thiết lập tài khoản nhân viên thuộc công ty.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-staff-account"
            >
              <div className="grid gap-4">
                <FormFieldCustom
                  name="fullName"
                  label="Họ và tên"
                  icon={<User size={18} />}
                  placeholder="Nhập tên người quản lý..."
                  required
                />

                <FormFieldCustom
                  name="email"
                  label="Email đăng nhập"
                  icon={<Mail size={18} />}
                  placeholder="example@gmail.com"
                  required
                />

                <FormFieldCustom
                  name="role"
                  label="Chức vụ"
                  icon={<Building2 size={18} />}
                  placeholder="Chọn chức vụ"
                  type="select"
                  selectData={roleOptions}
                  required
                />

                <FormFieldCustom
                  name="warehouseId"
                  label="Kho làm việc"
                  icon={<Building2 size={18} />}
                  placeholder="Chọn kho làm việc"
                  type="select"
                  selectData={warehouseOptions}
                  required
                />
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
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
            form="form-create-staff-account"
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

export default CreateStaffModal;
