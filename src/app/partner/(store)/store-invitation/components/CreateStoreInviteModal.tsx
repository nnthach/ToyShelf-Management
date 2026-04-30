"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { inviteToStoreAPI } from "@/src/services/store-invite.service";
import {
  getAllStoreAPI,
} from "@/src/services/store.service";
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
import { SelectOption } from "@/src/types/SubType";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Plus, Send, Sparkles, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

function CreateStoreInviteModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const { partner } = useAuth();

  const partnerId = partner?.partnerId;

  const formSchema = z.object({
    email: z.string().min(1, "Email là bắt buộc"),
    storeRole: z.string().min(1, "Vai trò trong cửa hàng là bắt buộc"),
    storeId: z.string().min(1, "Cửa hàng là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      storeId: "",
      storeRole: "Manager",
    },
  });

  const { data: partnerStoreList = [] } = useQuery({
    queryKey: ["partnerStores"],
    queryFn: () => getAllStoreAPI({ companyid: partnerId }),
    select: (res) => res.data as Store[],
    enabled: !!partnerId,
  });

  const storeOptions: SelectOption[] = partnerStoreList.map((store) => ({
    value: store.id,
    label: store.name,
  }));

  async function onSubmit(data: z.input<typeof formSchema>) {
    try {
      await inviteToStoreAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["storeInvites"],
      });

      form.reset();
      toast.success("Mời nhân viên thành công");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Mời nhân viên thất bại"));
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
          <Plus /> Tạo lời mời
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header: Tone xanh lá nhẹ nhàng, thân thiện */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Tạo lời mời mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-emerald-500" />
            Gửi lời mời nhân viên tham gia quản lý cửa hàng.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-store-invite"
            >
              {/* CHỌN CỬA HÀNG */}
              <FormFieldCustom
                name="storeId"
                label="Cửa hàng"
                placeholder="Chọn cửa hàng cần quản lý"
                type="select"
                selectData={storeOptions}
                icon={<StoreIcon size={18} />}
                required
              />

              {/* NHẬP EMAIL */}
              <FormFieldCustom
                name="email"
                label="Email người nhận"
                placeholder="email@gmail.com"
                icon={<Mail size={18} />}
                required
              />
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
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
            form="form-create-store-invite"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Send className="h-4 w-4" />
            Gửi lời mời
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStoreInviteModal;
