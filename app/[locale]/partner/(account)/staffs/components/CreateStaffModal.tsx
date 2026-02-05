import { PARTNER_LEVEL_OPTIONS } from "@/shared/constants/partner-level";
import { inviteToStoreAPI } from "@/shared/services/store-invite.service";
import { getAllStoreAPI } from "@/shared/services/store.service";
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
import { Store } from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

function CreateStaffModal() {
  const tButton = useTranslations("admin.button");
  const tStatus = useTranslations("status.partner");
  const tCommon = useTranslations("common");
  const tFields = useTranslations("partner.fields");
  const tCreateStaff = useTranslations("admin.staffs.createStaff");

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
            <Plus /> {tButton("createPartner")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tCreateStaff("header")}</DialogTitle>
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
                  name="email"
                  label={tFields("email")}
                  placeholder={tFields("email")}
                />
                <FormFieldCustom
                  name="storeRole"
                  label={tFields("storeRole")}
                  placeholder={tFields("storeRole")}
                />
                <FormFieldCustom
                  name="storeId"
                  label={tFields("store")}
                  placeholder={`${tCommon("select")} ${tFields("store")}`}
                  type="select"
                  selectData={storeOptions}
                />
              </div>
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="form-create-partner">
              {tButton("publish")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateStaffModal;
