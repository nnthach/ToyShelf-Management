"use client";
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
import { SketchPicker } from "react-color";
import namer from "color-namer";
import { createProductColorAPI } from "@/src/services/product-color.service";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";

function CreateProductColorModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    name: z.string("").min(1, "Tên màu là bắt buộc"),
    hexCode: z.string("").min(1, "Mã màu là bắt buộc"),
    skuCode: z.string(""),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hexCode: "#000000",
      skuCode: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("partner dâta", data);
    try {
      await createProductColorAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["colors"],
      });

      form.reset();
      toast.success("Thêm màu mới thành công");

      setOpen(false);
    } catch (error) {
      console.log("create color err", error);
      toast.error("Thêm màu mới thất bại");
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
      <form>
        <DialogTrigger asChild>
          <Button className="btn-primary-gradient">
            <Plus /> Thêm màu sắc sản phẩm
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm màu sắc sản phẩm</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mb-2"
              id="form-create-partner"
            >
              <div className="flex items-center justify-between gap-3">
                {/* TÊN MÀU */}
                <FormFieldCustom
                  name="name"
                  label="Tên màu"
                  placeholder="Ví dụ: Đỏ đô"
                />

                {/* HEX INPUT */}
                <FormFieldCustom
                  name="hexCode"
                  label="HEX Code"
                  placeholder="#000000"
                />
              </div>

              {/* COLOR PICKER */}
              <div className="w-full">
                <SketchPicker
                  color={form.watch("hexCode")}
                  onChange={(color) => {
                    const result = namer(color.hex);
                    const colorName = result.basic[0].name.toUpperCase();

                    form.setValue("name", colorName);
                    form.setValue("hexCode", color.hex);
                  }}
                />
              </div>
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" form="form-create-partner">
              Thêm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateProductColorModal;
