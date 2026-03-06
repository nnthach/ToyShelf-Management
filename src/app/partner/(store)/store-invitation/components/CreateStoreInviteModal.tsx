"use client";
import { PARTNER_LEVEL_OPTIONS } from "@/src/constants/partner-level";
import { PartnerFormValues, partnerSchema } from "@/src/schemas/partner.schema";
import { createPartnerStaffAccountAPI } from "@/src/services/account.service";
import { getAllPartnerTierAPI } from "@/src/services/partner-tier.service";
import { createPartnerAPI } from "@/src/services/partner.service";
import { inviteToStoreAPI } from "@/src/services/store-invite.service";
import { getAllPartnerStoreAPI } from "@/src/services/store.service";
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
import { PartnerTier, Store } from "@/src/types";
import { SelectOption } from "@/src/types/SubType";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

function CreateStoreInviteModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

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
    queryFn: () => getAllPartnerStoreAPI({}),
    select: (res) => res.data as Store[],
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
      console.log("create staff err", error);
      toast.error("Mời nhân viên thất bại");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo lời mời mới</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            id="form-create-store-invite"
          >
            <FormFieldCustom
              name="storeId"
              label="Cửa hàng"
              placeholder="Chọn cửa hàng"
              type="select"
              selectData={storeOptions}
            />
            <FormFieldCustom name="email" label="Email" placeholder="Email" />
          </form>
        </FormProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="form-create-store-invite">
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStoreInviteModal;
