import { getAllProductColorColorAPI } from "@/src/services/product.service";
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
import { ProductColorItem } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Mail, Plus, Send, Sparkles, User } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

function CreateInventoryModal() {
  const formSchema = z.object({
    inventoryLocationId: z.string().min(1, "Vị trí kho hàng bắt buộc nhập"),
    productColorId: z.string().min(1, "Sản phẩm bắt buộc phải nhập"),
    quantity: z.coerce.number().min(1, "Phải nhập số lượng"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inventoryLocationId: "regregre",
      productColorId: "",
      quantity: 0,
    },
  });

  function onSubmit(data: z.input<typeof formSchema>) {
    // Do something with the form values.
    console.log(" dâta", data);
  }

  const { data: productColorIdList = [] } = useQuery({
    queryKey: ["productColors"],
    queryFn: () => getAllProductColorColorAPI({}),
    select: (res) => res.data as ProductColorItem[],
  });

  const productColorOptions = productColorIdList.map((c) => ({
    value: c.id,
    label: c.sku,
  }));

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Thêm hàng hóa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header: Chuyên nghiệp với icon Sparkles */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Thêm hàng hóa
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-violet-500" />
            Cập nhật số lượng hàng chính xác.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body: Khoảng cách thoáng (space-y-5) */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Form errors:", errors);
                console.log("Current values:", form.getValues());
              })}
              className="space-y-5"
              id="form-create-inventory"
            >
              <FormFieldCustom
                name="productColorId"
                label="Sản phẩm"
                icon={<Mail size={18} />}
                selectData={productColorOptions}
                type="select"
              />
              <FormFieldCustom
                name="quantity"
                label="Số lượng"
                icon={<Mail size={18} />}
                type="number"
              />
            </form>
          </FormProvider>
        </div>

        {/* Footer: Nút bấm đồng bộ với các modal trước */}
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
            onClick={() => console.log("alo", form)}
            form="form-create-inventory"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Send className="h-4 w-4" />
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInventoryModal;
