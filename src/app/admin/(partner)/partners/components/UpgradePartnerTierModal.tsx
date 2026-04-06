"use client";
import { upgradePartnerTierAPI } from "@/src/services/commission-table-apply.service";
import { getAllPartnerTierAPI } from "@/src/services/partner-tier.service";
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
import { PartnerTier } from "@/src/types";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowBigUpDash,
  Award,
  Info,
  Send,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

function UpgradePartnerTierModal({ partnerId }: { partnerId: string }) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    partnerId: z.string().min(1, "ID đối tác là bắt buộc"),
    newTierId: z.string().min(1, "Vui lòng chọn cấp bậc mới"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerId: partnerId,
      newTierId: "",
    },
  });

  const { data: partnerTierList = [], isLoading } = useQuery({
    queryKey: ["partnerTiers", { isActive: undefined }],
    queryFn: () => getAllPartnerTierAPI({ isActive: undefined }),
    select: (res) => res.data as PartnerTier[],
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await upgradePartnerTierAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["partner"],
      });

      form.reset();
      toast.success("Nâng cấp thành công");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Nâng cấp thất bại"));
    }
  }

  const partnerTierOptions = partnerTierList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) form.reset({ partnerId, newTierId: "" });
      }}
    >
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-all border border-blue-400/50 shadow-lg shadow-blue-900/40 flex items-center gap-2 group">
          <TrendingUp
            size={14}
            className="group-hover:-translate-y-0.5 transition-transform"
          />
          Nâng cấp đối tác
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        {/* Header với Gradient Blue */}
        <DialogHeader className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowBigUpDash size={80} />
          </div>

          <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Award className="text-yellow-400" />
            Nâng cấp đối tác
          </DialogTitle>
          <DialogDescription className="text-blue-100 font-medium opacity-90 mt-2 flex items-center gap-2 italic">
            <Info size={14} /> Thay đổi phân hạng mức độ ưu tiên cho đối tác
            này.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-8 bg-white dark:bg-zinc-900">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              id="form-upgrade-tier"
            >
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-start gap-3">
                <ShieldCheck
                  className="text-blue-600 mt-1 shrink-0"
                  size={20}
                />
                <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed font-medium italic">
                  Việc nâng cấp cấp bậc sẽ thay đổi độ ưu tiên và các quyền lợi
                  đi kèm của đối tác trên toàn hệ thống.
                </p>
              </div>

              <FormFieldCustom
                name="newTierId"
                label="Chọn cấp bậc mới"
                icon={<Award size={18} className="text-blue-500" />}
                placeholder="Chọn hạng (Đồng, Bạc, Vàng...)"
                type="select"
                selectData={partnerTierOptions}
                required
              />

              {/* Hidden input cho partnerId */}
              <input type="hidden" {...form.register("partnerId")} />
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t flex gap-3 sm:gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none font-bold text-zinc-500 hover:bg-zinc-200"
            >
              Đóng
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-upgrade-tier"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Xác nhận
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpgradePartnerTierModal;
