"use client";
import { PARTNER_LEVEL_OPTIONS } from "@/src/constants/partner-level";
import { PartnerFormValues, partnerSchema } from "@/src/schemas/partner.schema";
import { createAllRoleAccountAPI } from "@/src/services/account.service";
import { getAllPartnerTierAPI } from "@/src/services/partner-tier.service";
import {
  createPartnerAPI,
  getAllPartnerAPI,
} from "@/src/services/partner.service";
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
import { Partner, PartnerTier, Role } from "@/src/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

function CreatePartnerAccountModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    email: z.string().min(1, "Email là bắt buộc"),
    fullName: z.string().min(1, "Tên đối tác là bắt buộc"),
    roleIds: z.array(z.string()).optional(),
    partnerId: z.string().min(1, "Sở hữu là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      roleIds: [],
      partnerId: "",
    },
  });

  const { data: partnerList = [], isLoading } = useQuery({
    queryKey: ["partners", { isActive: undefined }],
    queryFn: () => getAllPartnerAPI({ isActive: undefined }),
    select: (res) => res.data as Partner[],
  });

  const { data: roleList = [] } = useQuery({
    queryKey: ["roles", { isActive: undefined }],
    queryFn: () => getAllRoleAPI({ isActive: undefined }),
    select: (res) => res.data as Role[],
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const partnerRole = roleList.find((r) => r.name === "Partner");

    const payload = {
      ...data,
      roleIds: partnerRole ? [partnerRole.id] : [],
    };
    console.log("create partner account payload", payload);
    try {
      await createAllRoleAccountAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["partners"],
      });

      queryClient.invalidateQueries({
        queryKey: ["partner"],
      });

      form.reset();
      toast.success("Tạo đối tác thành công");

      setOpen(false);
    } catch (error) {
      console.log("create partner err", error);
      toast.error("Tạo đối tác thất bại");
    }
  }

  const partnerCompanyOptions = partnerList.map((s) => ({
    value: s.id,
    label: s.companyName,
  }));

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
          <Plus /> Thêm tài khoản đối tác
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm tài khoản đối tác mới</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            id="form-create-partner-account"
          >
            <FormFieldCustom
              name="email"
              label="Email đối tác"
              placeholder="Email đối tác"
            />
            <FormFieldCustom
              name="fullName"
              label="Tên đối tác"
              placeholder="Tên đối tác"
            />
            <FormFieldCustom
              name="partnerId"
              label="Công ty sở hữu"
              placeholder="Chọn công ty sở hữu"
              type="select"
              selectData={partnerCompanyOptions}
            />
          </form>
        </FormProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="form-create-partner-account">
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePartnerAccountModal;
