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
import { Check, Package, PackageCheck, Send, X, XCircle } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import {
  checkShelfItemsShipmentAPI,
  receiveShipmentAPI,
} from "@/src/services/shipment.service";
import { toast } from "react-toastify";
import Image from "next/image";
import { CheckReceiveShelfItem } from "@/src/types";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

type ConfirmReceiveModalProps = {
  shipmentId: string;
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type ReceiveStatus = "accepted" | "rejected" | undefined;

function ConfirmReceiveModal({
  shipmentId,
  requestId,
  isOpen,
  onClose,
  onSuccess,
}: ConfirmReceiveModalProps) {
  const queryClient = useQueryClient();
  const [receivedMap, setReceivedMap] = useState<Record<string, boolean>>({});

  const { data: checkShelfShipmentItems, isLoading } = useQuery({
    queryKey: [
      "checkShelfShipmentItems",
      shipmentId,
    ],
    queryFn: () =>
      checkShelfItemsShipmentAPI(shipmentId!),
    select: (res) => res.data,
    enabled: !!shipmentId && isOpen,
  });

  useEffect(() => {
    if (!isOpen || !checkShelfShipmentItems) return;

    const initialMap: Record<string, boolean> = {};

    checkShelfShipmentItems.forEach((item: CheckReceiveShelfItem) => {
      initialMap[item.shelfId] = true;
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReceivedMap(initialMap);
  }, [isOpen, checkShelfShipmentItems]);

  async function onSubmit() {
    const payload = {
      shelfItems: Object.entries(receivedMap).map(([shelfId, isReceived]) => ({
        shelfId,
        isReceived,
      })),
    };
    console.log("payload", payload);

    try {
      await receiveShipmentAPI("e1df5160-b153-41e9-82a8-c0ed6d1f12e8", payload);
      queryClient.invalidateQueries({ queryKey: ["refillRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["storeOrderDetail", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipmentDetail", shipmentId],
      });

      toast.success("Xác nhận thành công");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Xác nhận thất bại"));
    }
  }

  const hasUnconfirmed = Object.values(receivedMap).some(
    (v) => v === undefined,
  );

  return (
    <Dialog
      open={isOpen}
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

        {/*MAin content */}
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 bg-white">
          {isLoading ? (
            <div className="py-10 text-center text-slate-400">
              Đang tải danh sách kệ...
            </div>
          ) : (
            checkShelfShipmentItems?.map((item: CheckReceiveShelfItem) => {
              const isChecked = receivedMap[item.shelfId] ?? false;

              return (
                <div
                  key={item.shelfId}
                  className={`flex items-center justify-between p-4 border rounded-2xl bg-white transition-all ${
                    isChecked
                      ? "border-green-200 shadow-sm"
                      : "border-slate-200"
                  }`}
                >
                  {/* BÊN TRÁI: INFO & BADGE TRẠNG THÁI */}
                  <div className="flex flex-col gap-2">
                    {/* Badge trạng thái xác nhận */}
                    <div>
                      {isChecked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-200">
                          <Check className="w-3 h-3" /> Đã xác nhận
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />{" "}
                          Chờ xác nhận
                        </span>
                      )}
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div>
                      <p className="font-bold text-slate-800 text-[14px] uppercase tracking-tight leading-tight">
                        {item.shelfTypeName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        ID: {item.shelfId.split("-")[0]}...
                      </p>
                    </div>
                  </div>

                  {/* BÊN PHẢI: CẶP NÚT ACTION */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    {/* Nút X - Từ chối/Chưa nhận */}
                    <button
                      type="button"
                      onClick={() =>
                        setReceivedMap((prev) => ({
                          ...prev,
                          [item.shelfId]: false,
                        }))
                      }
                      className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all ${
                        !isChecked
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-slate-400 hover:text-red-500"
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Nút Check - Đồng ý/Đã nhận */}
                    <button
                      type="button"
                      onClick={() =>
                        setReceivedMap((prev) => ({
                          ...prev,
                          [item.shelfId]: true,
                        }))
                      }
                      className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all ${
                        isChecked
                          ? "bg-green-600 text-white shadow-md shadow-green-100"
                          : "text-slate-400 hover:text-green-600"
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-50 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onClose();
            }}
            className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 transition-all"
          >
            <XCircle className="mr-2 h-4 w-4 opacity-50" /> Huỷ
          </Button>

          <Button
            type="submit"
            onClick={onSubmit}
            disabled={hasUnconfirmed}
            className="flex-[1.5] h-12 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98]"
          >
            <Send className="mr-2 h-4 w-4" />
            Xác nhận nhận kệ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(ConfirmReceiveModal);
