"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { PackageCheck } from "lucide-react";
import { memo, useEffect } from "react";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import {
  getShipmentForReceiveByIdAPI,
  receiveShipmentAPI,
} from "@/src/services/shipment.service";
import { toast } from "react-toastify";
import Image from "next/image";
import { formatColorNameToVN } from "@/src/utils/format";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { ShipmentProductItem } from "@/src/types";

type ConfirmReceiveModalProps = {
  shipmentId: string | null;
  isOpen: string | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const formSchema = z.object({
  productItems: z.array(
    z.object({
      shipmentItemId: z.string(),
      receivedQuantity: z.coerce
        .number()
        .min(0, "Số lượng không được âm")
        .max(10000, "Số lượng quá lớn"),
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

  const { data: productItems, isLoading } = useQuery({
    queryKey: ["shipmentReceive", shipmentId],
    queryFn: () => getShipmentForReceiveByIdAPI(shipmentId!),
    select: (res) => res.data.productItems,
    enabled: !!shipmentId && !!isOpen,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productItems: [],
    },
  });

  useEffect(() => {
    if (isOpen && productItems) {
      form.reset({
        productItems: productItems.map((item: ShipmentProductItem) => ({
          shipmentItemId: item.shipmentItemId,
          receivedQuantity: item.expectedQuantity,
        })),
      });
    }
  }, [isOpen, productItems, form]);

  async function onSubmit(data: z.input<typeof formSchema>) {
    console.log("data", data);
    try {
      await receiveShipmentAPI(shipmentId!, data);
      queryClient.invalidateQueries({
        queryKey: ["shipmentDetail", shipmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["refillRequests"] });
      toast.success("Xác nhận nhận hàng thành công");
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
        <div className="bg-slate-50 px-6 py-6 border-b border-slate-100">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
                <PackageCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  Xác nhận nhận hàng
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  Kiểm kê và nhập số lượng thực tế trong lô hàng
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
                  {productItems?.map(
                    (item: ShipmentProductItem, index: number) => (
                      <div
                        key={item.shipmentItemId}
                        className="grid grid-cols-12 gap-4 items-center bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-200 transition-colors"
                      >
                        <div className="col-span-8 flex gap-3 items-start">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-slate-50">
                            <Image
                              src={item.imageUrl || "/placeholder.png"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate">
                              {item.productName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border">
                                {formatColorNameToVN(item.colorName)}
                              </span>
                            </div>
                            <p className="text-[11px] mt-2 text-slate-500">
                              Số lượng gửi:{" "}
                              <span className="font-bold text-slate-900">
                                {item.expectedQuantity}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="col-span-4 border-l border-slate-100 pl-4">
                          <FormFieldCustom
                            name={`productItems.${index}.receivedQuantity`}
                            type="number"
                            label="Thực nhận"
                            className="h-9 text-sm font-bold text-blue-600"
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </ScrollArea>
          </form>
        </FormProvider>

        <div className="p-6 bg-white border-t flex items-center gap-3">
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
