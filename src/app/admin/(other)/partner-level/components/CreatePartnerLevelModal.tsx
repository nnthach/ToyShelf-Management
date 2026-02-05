import { PARTNER_LEVEL_OPTIONS } from "@/src/constants/partner-level";
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
import { Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

function CreatePartnerLevelModal() {
  const formSchema = z.object({
    fullname: z.string("").min(1, "Tên là bắt buộc"),
    adminOfStore: z.string("").min(1, "Admin của cửa hàng là bắt buộc"),
    partnerLevel: z.string("").min(1, "Cấp độ đối tác là bắt buộc"),
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

  const partnerLevelOption = PARTNER_LEVEL_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
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
            <Plus /> Tạo mới danh mục sản phẩm
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo mới danh mục sản phẩm</DialogTitle>
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
                  name="fullname"
                  label="Tên"
                  placeholder="Tên"
                />
                <FormFieldCustom
                  name="partnerLevel"
                  label="Cấp độ đối tác"
                  placeholder="Chọn cấp độ đối tác"
                  type="select"
                  selectData={partnerLevelOption}
                />
              </div>
              <FormFieldCustom
                name="adminOfStore"
                label="Admin của cửa hàng"
                placeholder="Chọn admin của cửa hàng"
                type="select"
                selectData={partnerLevelOption}
              />
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="form-create-partner">
              Tạo mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreatePartnerLevelModal;
