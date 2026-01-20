import { PARTNER_LEVEL_OPTIONS } from "@/shared/constants/partner-level";
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
import { SelectOption } from "@/shared/types/SubType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

function CreateProductPriceLevelModal() {
  const tButton = useTranslations("admin.button");
  const tStatus = useTranslations("status.partner");
  const tCommon = useTranslations("common");
  const tFields = useTranslations("admin.productPriceLevel.fields");
  const tCreateProductPriceLevel = useTranslations(
    "admin.productPriceLevel.createProductPriceLevel",
  );

  const formSchema = z.object({
    name: z.string("").min(1, `${tFields("name")} ${tCommon("isRequired")}`),
    description: z
      .string("")
      .min(1, `${tFields("description")} ${tCommon("isRequired")}`),
    priceFrom: z
      .string("")
      .min(1, `${tFields("priceFrom")} ${tCommon("isRequired")}`),
    priceTo: z
      .string("")
      .min(1, `${tFields("priceTo")} ${tCommon("isRequired")}`),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      priceFrom: "",
      priceTo: "",
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
      <form>
        <DialogTrigger asChild>
          <Button className="btn-primary-gradient">
            <Plus /> {tCreateProductPriceLevel("header")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tCreateProductPriceLevel("header")}</DialogTitle>
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
                  name="name"
                  label={tFields("name")}
                  placeholder={tFields("name")}
                />
                <FormFieldCustom
                  name="description"
                  label={tFields("description")}
                  placeholder={tFields("description")}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormFieldCustom
                  name="priceFrom"
                  label={tFields("priceFrom")}
                  placeholder={tFields("priceFrom")}
                />
                <FormFieldCustom
                  name="priceTo"
                  label={tFields("priceTo")}
                  placeholder={tFields("priceTo")}
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

export default CreateProductPriceLevelModal;
