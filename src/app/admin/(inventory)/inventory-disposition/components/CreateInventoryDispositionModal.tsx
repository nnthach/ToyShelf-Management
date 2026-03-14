"use client";

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
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Send, Sparkles, Tag } from "lucide-react";
import { memo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { createInventoryDispositionAPI } from "@/src/services/inventory-disposition.service";

function CreateInventoryDispositionModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    code: z.string().min(1, "Code là bắt buộc"),
    description: z.string().min(1, "Code là bắt buộc"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      ...data,
      code: data.code.toUpperCase(),
    };
    try {
      await createInventoryDispositionAPI(payload);
      queryClient.invalidateQueries({
        queryKey: ["inventoryDispositions"],
      });
      form.reset();
      toast.success("Tạo trạng thái hàng tồn kho thành công");
      setOpen(false);
    } catch (error) {
      toast.error("Tạo trạng thái hàng tồn kho thất bại");
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
          <Plus />
          Thêm trạng thái mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ với hệ thống */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Thêm trạng thái mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-blue-500" />
            Phân loại trạng thái.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-inventory-disposition"
            >
              <FormFieldCustom
                name="code"
                label="Mã trạng thái"
                placeholder="Ví dụ: AVAILABLE"
                icon={<Tag size={18} />}
              />

              <FormFieldCustom
                name="description"
                label="Mô tả trạng thái"
                placeholder="Nhập vài dòng mô tả ngắn gọn..."
                type="textarea"
                icon={<FileText size={18} />}
                className="min-h-[100px]"
              />
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
            form="form-create-inventory-disposition"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Send className="h-4 w-4" />
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateInventoryDispositionModal);
