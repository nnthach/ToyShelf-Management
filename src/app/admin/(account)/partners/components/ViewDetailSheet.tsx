"use client";

import { Button } from "@/src/styles/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/src/styles/components/ui/card";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { DollarSign, Home } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { FormProvider, useForm } from "react-hook-form";
import { PartnerFormValues, partnerSchema } from "@/src/schemas/partner.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PARTNER_LEVEL_OPTIONS } from "@/src/constants/partner-level";
import { useEffect } from "react";
import {
  getPartnerDetailAPI,
  updatePartnerAPI,
} from "@/src/services/partner.service";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";

type ViewDetailSheetProps = {
  partnerId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({ partnerId, isOpen, onClose }: ViewDetailSheetProps) {
  const queryClient = useQueryClient();

  const { data: partnerDetail, isLoading } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartnerDetailAPI(partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      companyName: "",
      tier: "",
      revenueSharePercent: 0,
    },
  });

  useEffect(() => {
    if (partnerDetail) {
      form.reset({
        companyName: partnerDetail.companyName,
        tier: partnerDetail.tier,
        revenueSharePercent: partnerDetail.revenueSharePercent,
      });
    }
  }, [partnerDetail, form]);

  const partnerLevelOption = PARTNER_LEVEL_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const revenueOption = [
    { value: 5, label: "5%" },
    { value: 10, label: "10%" },
    { value: 15, label: "15%" },
  ];

  async function onSubmit(data: PartnerFormValues) {
    try {
      await updatePartnerAPI(data, partnerId!);

      queryClient.invalidateQueries({
        queryKey: ["partners"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["partner", partnerId],
      });

      form.reset();
      toast.success("Cập nhật đối tác thành công");
    } catch (error) {
      console.log("Update partner err", error);
      toast.error("Cập nhật đối tác thất bại");
    }
  }

  if (!partnerId) return null;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>Thông tin đối tác</SheetTitle>
          <SheetDescription>
            Thông tin về {partnerDetail?.email}
          </SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">
            {/* --- Top Stats Cards --- */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                        <Home className="text-white dark:text-black" />
                      </div>
                      <p className="text-primary text-lg">Total Orders</p>
                    </div>

                    <p className="text-xl font-bold text-primary">7 Orders</p>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Card 2 */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                        <DollarSign className="text-white dark:text-black" />
                      </div>
                      <p className="text-primary text-lg">Total Spending</p>
                    </div>

                    <p className="text-xl font-bold text-primary">
                      19,000,000 VND
                    </p>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* --- Recent order --- */}
            <div className="mt-4 border rounded-lg bg-background">
              <div className="border-b px-4 py-3 bg-background">
                <p className="font-medium">
                  Recent Orders <span className="text-gray-500">(9)</span>
                </p>
              </div>

              {/* Item */}
              <ScrollArea className="h-[380px] mt-3">
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 hover:bg-gray-200 dark:hover:bg-accent"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-md bg-gray-200" />

                      {/* Info */}
                      <div className="flex-1">
                        <p className="font-semibold">
                          £{(2300000 - i * 100000).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          📍 London, St John’s Hill 62
                        </p>
                      </div>

                      {/* Status */}
                      <span className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/*Right */}
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
                    name="tier"
                    label="Cấp bậc"
                    placeholder="Chọn cấp bậc"
                    type="select"
                    selectData={partnerLevelOption}
                  />
                  <FormFieldCustom
                    name="revenueSharePercent"
                    label="Phần trăm chia sẻ doanh thu"
                    placeholder="Chọn phần trăm chia sẻ doanh thu"
                    type="select"
                    selectData={revenueOption}
                  />
                </form>
              </FormProvider>
            </div>

            <SheetFooter>
              <Button type="submit" form="form-update-partner">
                Lưu thay đổi
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Đóng</Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
