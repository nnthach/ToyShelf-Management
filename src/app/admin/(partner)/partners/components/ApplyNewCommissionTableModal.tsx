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
import {
  Calendar,
  FilePlus,
  Info,
  Layers,
  Plus,
  Send,
  Trophy,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { CommissionTable } from "@/src/types";
import { getAllCommissionTableAPI } from "@/src/services/commission-table.service";
import { createCommissionTableApplyAPI } from "@/src/services/commission-table-apply.service";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

function ApplyNewCommissionTableModal({ partnerId }: { partnerId: string }) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    commissionTableId: z.string().min(1, "Bảng giá là bắt buộc"),
    name: z.string().min(1, "Tên là bắt buộc"),
    startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    endDate: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commissionTableId: "",
      name: "",
      startDate: "",
      endDate: "",
    },
  });

  const { data: commissionTableList } = useQuery({
    queryKey: ["commissionTables"],
    queryFn: () => getAllCommissionTableAPI({}),
    select: (res) => res.data as CommissionTable[],
  });

  const commissionTableOptions = commissionTableList?.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  async function onSubmit(data: z.output<typeof formSchema>) {
    try {
      await createCommissionTableApplyAPI({ ...data, partnerId });

      queryClient.invalidateQueries({
        queryKey: ["partner"],
      });

      form.reset();
      toast.success("Áp dụng bảng hoa hồng thành công");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Áp dụng bảng hoa hồng thất bại"));
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
        <Button
          variant="secondary"
          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-md text-[12px] border border-white/10"
        >
          <FilePlus />
          Áp dụng hoa hồng mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header tối giản */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Áp dụng bảng hoa hồng
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Info size={14} />
            Thiết lập mức chiết khấu hoa hồng theo từng phân khúc sản phẩm.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="form-create-commission-policy"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <FormFieldCustom
                    name="commissionTableId"
                    label="Bảng hoa hồng"
                    type="select"
                    placeholder="Chọn bảng hoa hồng"
                    selectData={commissionTableOptions}
                    icon={<Layers size={16} />}
                    required
                  />
                </div>

                <FormFieldCustom
                  name="name"
                  label="Tên"
                  placeholder="Tên"
                  icon={<Trophy size={16} />}
                  required
                />

                <FormFieldCustom
                  name="startDate"
                  label="Ngày bắt đầu"
                  type="date"
                  icon={<Calendar size={16} />}
                  required
                />
                <FormFieldCustom
                  name="endDate"
                  label="Ngày kết thúc"
                  type="date"
                  icon={<Calendar size={16} />}
                  required
                />
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
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
            form="form-create-commission-policy"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Send className="h-4 w-4" />
            Xác nhận thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ApplyNewCommissionTableModal;
