import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../styles/components/ui/dialog";
import { FormFieldCustom } from "../styles/components/custom/FormFieldCustom";
import { Button } from "../styles/components/ui/button";
import { useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { updateMyProfileAPI } from "../services/user.service";

function AccountAdminProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAppSelector((state) => state.auth);

  const formSchema = z.object({
    fullName: z.string().min(1, "Không được để trống"),
    avatarUrl: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user?.fullName || "",
        avatarUrl: user?.avatarUrl || "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(" data", data);
    try {
      const res = await updateMyProfileAPI(data);
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
          <DialogTitle>Thông tin cá nhân</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            id="form-edit-profile"
          >
            <FormFieldCustom
              name="fullName"
              label="Tên đầy đủ"
              placeholder="Nguyen Van A"
            />
          </form>
        </FormProvider>
        <DialogFooter>
          <Button type="submit" form="form-edit-profile">
            Chỉnh sửa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AccountAdminProfileModal;
