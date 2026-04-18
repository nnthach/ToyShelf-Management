"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PackageCheck } from "lucide-react";
import { memo, useEffect } from "react";
import {
  getShipmentForReceiveByIdAPI,
  receiveShipmentAPI,
} from "@/src/services/shipment.service";
import { toast } from "react-toastify";
import { ShipmentShelfItem } from "@/src/types";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import Image from "next/image";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";

type ConfirmReceiveModalProps = {
  shipmentId: string | null;
  isOpen: string | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const formSchema = z.object({
  shelfItems: z.array(
    z.object({
      shelfShipmentItemId: z.string(),
      isReceived: z.boolean(),
    }),
  ),
});

type FormValues = z.input<typeof formSchema>;

function ConfirmReceiveModal({
  shipmentId,
  isOpen,
  onClose,
  onSuccess,
}: ConfirmReceiveModalProps) {
  const queryClient = useQueryClient();

  const { data: shelfItems, isLoading } = useQuery({
    queryKey: ["shipmentReceive", shipmentId],
    queryFn: () => getShipmentForReceiveByIdAPI(shipmentId!),
    select: (res) => res.data.shelfItems,
    enabled: !!shipmentId && !!isOpen,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shelfItems: [],
    },
  });

  useEffect(() => {
    if (isOpen && shelfItems) {
      form.reset({
        shelfItems: shelfItems.map((item: ShipmentShelfItem) => ({
          shelfShipmentItemId: item.shelfShipmentItemId,
          isReceived: false, // ← default
        })),
      });
    }
  }, [isOpen, shelfItems, form]);

  async function onSubmit(data: z.input<typeof formSchema>) {
    console.log("data", data);

    try {
      await receiveShipmentAPI(shipmentId!, data);
      queryClient.invalidateQueries({
        queryKey: ["shipmentDetail", shipmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["refillShelfRequests"] });

      toast.success("Xác nhận thành công");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Xác nhận thất bại"));
    }
  }

  return (
    <Dialog
      open={!!isOpen}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header với Gradient nhẹ */}
        <div className="bg-slate-50 px-6 py-6 border-b border-slate-100">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
                <PackageCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  Xác nhận nhận kệ
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  Kiểm tra kệ thực nhận và xác nhận
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <FormProvider {...form}>
          <form
            id="form-confirm-receive"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ScrollArea className="max-h-[60vh] px-6 py-4">
              {isLoading ? (
                <div className="py-10 text-center text-slate-400">
                  Đang tải dữ liệu...
                </div>
              ) : (
                <div className="space-y-4">
                  {shelfItems?.map((item: ShipmentShelfItem, index: number) => (
                    <div
                      key={item.shelfShipmentItemId}
                      className="grid grid-cols-12 gap-4 items-center bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-200 transition-colors"
                    >
                      <div className="col-span-8 flex gap-3 items-start">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-slate-50">
                          <Image
                            src={item.imageUrl || "/placeholder.png"}
                            alt={item.shelfTypeName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 truncate">
                            {item.shelfTypeName}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-4 border-l border-slate-100 pl-4">
                        <FormFieldCustom
                          name={`shelfItems.${index}.isReceived`}
                          type="switch"
                          label="Đã nhận"
                          className="h-9 text-sm font-bold text-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </form>
        </FormProvider>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-50 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 border-slate-200"
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            form="form-confirm-receive"
            className="flex-[1.5] bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Đang xử lý..."
              : "Xác nhận nhận hàng"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(ConfirmReceiveModal);
