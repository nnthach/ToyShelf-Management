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

function CreateProductPriceLevelModal() {
  const formSchema = z.object({
    name: z.string("").min(1, "Tên cấp độ giá sản phẩm là bắt buộc"),
    description: z.string("").min(1, "Mô tả cấp độ giá sản phẩm là bắt buộc"),
    priceFrom: z.string("").min(1, "Giá từ là bắt buộc"),
    priceTo: z.string("").min(1, "Giá đến là bắt buộc"),
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
            <Plus /> Thêm cấp độ giá sản phẩm2
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm cấp độ giá sản phẩm</DialogTitle>
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
                  label="Tên cấp độ giá sản phẩm"
                  placeholder="Tên cấp độ giá sản phẩm"
                />
                <FormFieldCustom
                  name="description"
                  label="Mô tả cấp độ giá sản phẩm"
                  placeholder="Mô tả cấp độ giá sản phẩm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormFieldCustom
                  name="priceFrom"
                  label="Giá từ"
                  placeholder="Giá từ"
                />
                <FormFieldCustom
                  name="priceTo"
                  label="Giá đến"
                  placeholder="Giá đến"
                />
              </div>
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="form-create-partner">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateProductPriceLevelModal;
