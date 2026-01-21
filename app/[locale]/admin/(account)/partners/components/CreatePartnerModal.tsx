"use client";
import { PARTNER_LEVEL_OPTIONS } from "@/shared/constants/partner-level";
import {
  PartnerFormValues,
  partnerSchema,
} from "@/shared/schemas/partner.schema";
import { createPartnerAPI } from "@/shared/services/partner.service";
import { FormFieldCustom } from "@/shared/styles/components/custom/FormFieldCustom";
import { Button } from "@/shared/styles/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

function CreatePartnerModal() {
  const locale = useLocale();
  const tButton = useTranslations("admin.button");
  const tStatus = useTranslations("status.partner");
  const tCommon = useTranslations("common");
  const tFields = useTranslations("admin.partners.fields");
  const tCreatePartner = useTranslations("admin.partners.createPartner");
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      companyName: "",
      tier: "",
      revenueSharePercent: 0,
    },
  });

  async function onSubmit(data: PartnerFormValues) {
    try {
      await createPartnerAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["partners"],
      });

      form.reset();
      toast.success(
        locale === "vi"
          ? "Tạo đối tác thành công"
          : "Create partner successfully!",
      );

      setOpen(false);
    } catch (error) {
      console.log("create partner err", error);
      toast.error(
        locale === "vi" ? "Tạo đối tác thất bại" : "Failed to create partner",
      );
    }
  }

  const partnerLevelOption = PARTNER_LEVEL_OPTIONS.map((option) => ({
    value: option.value,
    label: tStatus(option.label),
  }));

  const revenueOption = [
    { value: 5, label: "5%" },
    { value: 10, label: "10%" },
    { value: 15, label: "15%" },
  ];

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
      <form>
        <DialogTrigger asChild>
          <Button className="btn-primary-gradient">
            <Plus /> {tButton("createPartner")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tCreatePartner("header")}</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
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
                  name="companyName"
                  label={tFields("companyName.label")}
                  placeholder={tFields("companyName.label")}
                />
                <FormFieldCustom
                  name="tier"
                  label={tFields("tier.label")}
                  placeholder={`${tCommon("select")} ${tFields("tier.label")}`}
                  type="select"
                  selectData={partnerLevelOption}
                />
              </div>
              <FormFieldCustom
                name="revenueSharePercent"
                label={tFields("revenueSharePercent.label")}
                placeholder={`${tCommon("select")} ${tFields("revenueSharePercent.label")}`}
                type="select"
                selectData={revenueOption}
              />
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form="form-create-partner"
              // disabled={createPartnerMutation.isPending}
            >
              {tButton("publish")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreatePartnerModal;
