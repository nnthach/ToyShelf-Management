import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../styles/components/ui/dialog";
import { FormFieldCustom } from "../styles/components/custom/FormFieldCustom";
import { Button } from "../styles/components/ui/button";
import {
  changePasswordRequestAPI,
  updateMyProfileAPI,
} from "../services/user.service";

function AccountAdminPasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const formSchema = z.object({
    newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z
      .string()
      .min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(" data", data);
    try {
      const res = await changePasswordRequestAPI(data);
      //   console.log("res", res);
    } catch (error) {
      console.log("update profile err", error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            id="form-change-password"
          >
            <FormFieldCustom
              name="newPassword"
              label="Mật khẩu mới"
              placeholder="Mật khẩu mới"
            />
            <FormFieldCustom
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu"
            />
          </form>
        </FormProvider>
        <DialogFooter>
          <Button type="submit" form="form-change-password">
            Cập nhật mật khẩu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AccountAdminPasswordModal;
