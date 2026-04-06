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
import { Hash, Palette, Pipette, Plus, Send, Sparkles } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { SketchPicker } from "react-color";
import namer from "color-namer";
import { createProductColorAPI } from "@/src/services/product-color.service";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

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
    try {
      await createProductColorAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["colors"],
      });

      form.reset();
      toast.success("Thêm màu mới thành công");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Thêm màu mới thất bại"));
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
          <Plus /> Thêm màu sắc sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Thêm màu sắc sản phẩm
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-amber-500" />
            Chọn màu sắc chính xác để hiển thị.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-color"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* TÊN MÀU */}
                <FormFieldCustom
                  name="name"
                  label="Tên màu"
                  labelNote="Tên tiếng anh"
                  placeholder="Ví dụ: Đỏ đô"
                  icon={<Palette size={18} />}
                  required
                />

                {/* HEX INPUT */}
                <FormFieldCustom
                  name="hexCode"
                  label="Mã HEX"
                  placeholder="#000000"
                  icon={<Hash size={18} />}
                  required
                />
              </div>

              {/* COLOR PICKER SECTION */}
              <div className="space-y-3 pt-2">
                <label className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
                  <Pipette size={16} className="text-primary" />
                  Bảng màu chi tiết
                </label>

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
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer đồng bộ */}
        <DialogFooter className="p-4 bg-slate-50/50 border-t flex gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 font-medium text-slate-600 hover:bg-slate-200"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-create-color"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Send className="h-4 w-4" />
            Xác nhận tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateProductColorModal);
