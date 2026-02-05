import { inviteToStoreAPI } from "@/src/services/store-invite.service";
import { getAllStoreAPI } from "@/src/services/store.service";
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
import { Store } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

function CreateStaffModal() {
  const { data: storeList = [], isLoading } = useQuery({
    queryKey: ["stores", { isActive: undefined }],
    queryFn: () => getAllStoreAPI({ isActive: undefined }),
    select: (res) => res.data as Store[],
  });

  const formSchema = z.object({
    storeId: z.string("").min(1),
    email: z.string("").min(1),
    storeRole: z.string("").min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeId: "",
      email: "",
      storeRole: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("partner dâta", data);
    try {
      const res = await inviteToStoreAPI(data);
      console.log("res", res);
    } catch (error) {
      console.log("invite staff to store err", error);
    }
  }

  const storeOptions = storeList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <form>
        <DialogTrigger asChild>
          <Button className="btn-primary-gradient">
            <Plus /> Thêm nhân viên
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo nhân viên</DialogTitle>
            <DialogDescription>
              Nhập thông tin nhân viên cận thêm. Nhấp lưu khi hoàn thành.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-create-partner"
            >
              <div className="grid grid-cols-2 gap-3">
                <FormFieldCustom
                  name="email"
                  label="Email"
                  placeholder="Email"
                />
                <FormFieldCustom
                  name="storeRole"
                  label="Vai trò cửa hàng"
                  placeholder="Vai trò cửa hàng"
                />
                <FormFieldCustom
                  name="storeId"
                  label="Cửa hàng"
                  placeholder="Chọn cửa hàng"
                  type="select"
                  selectData={storeOptions}
                />
              </div>
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy bỏ</Button>
            </DialogClose>
            <Button type="submit" form="form-create-partner">
              Xuất bản
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateStaffModal;
