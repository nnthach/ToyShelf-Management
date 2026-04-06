import { PartnerFormValues, partnerSchema } from "@/src/schemas/partner.schema";
import { getAllPartnerTierAPI } from "@/src/services/partner-tier.service";
import { updatePartnerAPI } from "@/src/services/partner.service";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { Button } from "@/src/styles/components/ui/button";
import { Partner, PartnerTier } from "@/src/types";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, RotateCcw, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type PartnerFormSheetProps = {
  partner: Partner;
  onClose: () => void;
};
function PartnerFormSheet({ partner, onClose }: PartnerFormSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      companyName: "",
      partnerTierId: "",
    },
  });

  useEffect(() => {
    if (partner) {
      form.reset({
        companyName: partner.companyName,
        partnerTierId: partner.partnerTierId,
      });
    }
  }, [partner, form]);

  async function onSubmit(data: PartnerFormValues) {
    try {
      await updatePartnerAPI(data, partner.id);

      queryClient.invalidateQueries({
        queryKey: ["partners"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["partner", partner.id],
      });

      form.reset();
      toast.success("Cập nhật đối tác thành công");
    } catch (error) {
      toast.error(getErrorMessage(error, "Cập nhật đối tác thất bại"));
    }
  }

  const { data: partnerTierList = [], isLoading } = useQuery({
    queryKey: ["partnerTiers", { isActive: undefined }],
    queryFn: () => getAllPartnerTierAPI({ isActive: undefined }),
    select: (res) => res.data as PartnerTier[],
  });

  const partnerTierOptions = partnerTierList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div className="bg-background flex-1 border-t border-border flex flex-col">
      <div className="grid flex-1 auto-rows-min gap-6 px-4 mt-4">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            id="form-update-partner"
          >
            <FormFieldCustom
              name="companyName"
              label="Tên công ty"
              placeholder="Tên công ty"
            />
            <FormFieldCustom
              name="partnerTierId"
              label="Cấp bậc"
              placeholder="Chọn cấp bậc"
              type="select"
              selectData={partnerTierOptions}
            />
          </form>
        </FormProvider>
      </div>

      <div className="border-t border-border px-4 py-3 mt-auto">
        <div className="flex items-center justify-between gap-2">
          {partner?.isActive ? (
            <Button
              variant="outline"
              title="Vô hiệu hóa"
              // onClick={() => handleDisable()}
            >
              <Lock color="red" />
            </Button>
          ) : (
            <div>
              <Button
                variant="outline"
                title="Xóa"
                // onClick={() => handleDelete()}
              >
                <Trash2 color="red" />
              </Button>

              <Button
                variant="outline"
                title="Khôi phục"
                // onClick={() => handleRestore()}
              >
                <RotateCcw color="aqua" />
              </Button>
            </div>
          )}
          <Button type="submit" form="form-update-partner" className="flex-1">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PartnerFormSheet;
