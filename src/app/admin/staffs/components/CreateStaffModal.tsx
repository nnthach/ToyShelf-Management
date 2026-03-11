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
import { Mail, Plus, Send, Sparkles, User } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

function CreateStaffModal() {
  const formSchema = z.object({
    fullname: z.string("").min(1, "Tên đầy đủ bắt buộc phải nhập"),
    adminOfStore: z.string("").min(1, "Của cửa hàng bắt buộc phải nhập"),
    partnerLevel: z.string("").min(1, "Cấp bậc đối tác bắt buộc phải nhập"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      adminOfStore: "",
      partnerLevel: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log("partner dâta", data);
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Thêm nhân viên
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header: Chuyên nghiệp với icon Sparkles */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Thêm nhân viên mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-violet-500" />
            Cấp tài khoản mới để nhân viên có thể truy cập hệ thống quản trị.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body: Khoảng cách thoáng (space-y-5) */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-staff"
            >
              <FormFieldCustom
                name="fullName"
                label="Họ và tên"
                placeholder="Ví dụ: Nguyễn Văn A"
                icon={<User size={18} />}
              />

              <FormFieldCustom
                name="email"
                label="Địa chỉ Email"
                placeholder="nva@company.com"
                icon={<Mail size={18} />}
              />
            </form>
          </FormProvider>
        </div>

        {/* Footer: Nút bấm đồng bộ với các modal trước */}
        <DialogFooter className="p-4 bg-slate-50/50 border-t flex gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 font-medium text-slate-600 hover:bg-slate-200"
            >
              Hủy bỏ
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-create-staff"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Send className="h-4 w-4" />
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStaffModal;
