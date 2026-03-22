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
import { useQueryClient } from "@tanstack/react-query";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { ClipboardList, Hash, PackageCheck, Send, XCircle } from "lucide-react";
import { RefillRequestProductColor } from "@/src/types";
import { memo, useEffect } from "react";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import { receiveShipmentAPI } from "@/src/services/shipment.service";
import { toast } from "react-toastify";

type ConfirmReceiveModalProps = {
  shipmentId: string;
  requestId: string;
  shipmentAssignId: string;
  isOpen: boolean;
  items: RefillRequestProductColor[];
  onClose: () => void;
  onSuccess: () => void;
};

function ConfirmReceiveModal({
  shipmentId,
  requestId,
  shipmentAssignId,
  isOpen,
  items,
  onClose,
  onSuccess,
}: ConfirmReceiveModalProps) {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    items: z.array(
      z.object({
        productColorId: z.string(),
        receivedQuantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
      }),
    ),
  });
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [],
    },
  });

  useEffect(() => {
    if (isOpen && items.length > 0) {
      form.reset({
        items: items.map((item) => ({
          productColorId: item.productColorId,
          receivedQuantity: 0,
        })),
      });
    }
  }, [isOpen, items, shipmentId, form]);

  async function onSubmit(data: z.input<typeof formSchema>) {
    console.log("data", data);
    try {
      await receiveShipmentAPI(shipmentId, data);
      queryClient.invalidateQueries({
        queryKey: ["requestDetail", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipmentAssignDetail", shipmentAssignId],
      });

      queryClient.invalidateQueries({
        queryKey: ["shipmentDetail", shipmentId],
      });

      form.reset();
      toast.success("Xác nhận thành công");
      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Xác nhận thất bại");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
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
                  Xác nhận nhận hàng
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  Nhập số lượng hàng thực tế nhận được
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log("VALIDATION ERROR:", err);
            })}
            id="form-confirm-receive"
          >
            <ScrollArea className="max-h-[60vh] px-6 py-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.productColorId}
                    className="grid grid-cols-12 gap-4 items-center bg-white border border-slate-200 rounded-xl p-3 transition-all hover:border-blue-200"
                  >
                    {/* CỘT TRÁI (8/12): Thông tin sản phẩm */}
                    <div className="col-span-8 space-y-1">
                      <div className="flex items-center gap-2">
                        <ClipboardList
                          size={14}
                          className="text-blue-500 shrink-0"
                        />
                        <p className="text-sm font-bold text-slate-700 truncate uppercase tracking-tight">
                          {item.productName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium ml-5">
                        <Hash size={10} />
                        <span className="truncate">{item.productColorId}</span>
                      </div>
                      <div className="ml-5 mt-1">
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Yêu cầu:{" "}
                          <span className="text-slate-800">
                            {item.quantity}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* CỘT PHẢI (4/12): Input nhập số lượng */}
                    <div className="col-span-4 border-l border-slate-100 pl-4">
                      <FormFieldCustom
                        name={`items.${index}.receivedQuantity`}
                        type="number"
                        placeholder="0"
                        label="Số lượng"
                        className="h-9 text-sm font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </form>
        </FormProvider>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-50 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset();
              onClose();
            }}
            className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 transition-all"
          >
            <XCircle className="mr-2 h-4 w-4 opacity-50" /> Huỷ
          </Button>

          <Button
            type="submit"
            form="form-confirm-receive"
            className="flex-[1.5] h-12 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98]"
          >
            <Send className="mr-2 h-4 w-4" />
            Xác nhận nhận hàng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(ConfirmReceiveModal);
