"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Send,
  Warehouse,
  Box,
  Package,
} from "lucide-react";
import { memo, useState, useMemo } from "react";
import { createShipmentAssignWarehouseAPI } from "@/src/services/shipment-assignment.service";
import { getStoreOrderAvailableWarehouseAPI } from "@/src/services/refill.service";
import { RefillRequestProductColor } from "@/src/types";
import { cn } from "@/src/styles/lib/utils";
import { formatColorNameToVN } from "@/src/utils/format";
import Image from "next/image";

type AssignWarehouseModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

interface WarehouseInventory {
  warehouseLocationId: string;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  items: RefillRequestProductColor[];
}

function AssignWarehouseModal({
  requestId,
  isOpen,
  onClose,
}: AssignWarehouseModalProps) {
  const queryClient = useQueryClient();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const { data: availableWarehouseList } = useQuery({
    queryKey: ["availableWarehouses", requestId],
    queryFn: () => getStoreOrderAvailableWarehouseAPI(requestId),
    select: (res) => res.data,
    enabled: isOpen,
  });

  // Tìm warehouse đang được chọn để hiển thị items bên dưới
  const selectedWarehouse = useMemo(() => {
    return availableWarehouseList?.find(
      (w: WarehouseInventory) => w.warehouseLocationId === selectedWarehouseId,
    );
  }, [selectedWarehouseId, availableWarehouseList]);

  async function onSubmit() {
    if (!selectedWarehouseId) {
      toast.warning("Vui lòng chọn một kho thực hiện");
      return;
    }

    setIsLoading(true);
    try {
      await createShipmentAssignWarehouseAPI({
        warehouseLocationId: selectedWarehouseId,
        storeOrderId: requestId,
      });

      queryClient.invalidateQueries({ queryKey: ["requestDetail", requestId] });
      queryClient.invalidateQueries({ queryKey: ["shipmentAssignDetail"] });

      toast.success("Điều phối kho thành công");
      onClose();
    } catch (error) {
      toast.error("Điều phối kho thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Warehouse className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Điều phối kho
              </DialogTitle>
              <DialogDescription>
                Chọn kho phù hợp để thực hiện đơn hàng
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: DANH SÁCH KHO */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-200">
                <Warehouse className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Danh sách kho phù hợp đơn hàng
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Hệ thống đã tự động lọc các kho phù họp đơn hàng
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 bg-slate-100 p-2 rounded-xl">
              {availableWarehouseList?.map((wh: WarehouseInventory) => (
                <div
                  key={wh.warehouseId}
                  onClick={() => setSelectedWarehouseId(wh.warehouseLocationId)}
                  className={cn(
                    "cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between",
                    selectedWarehouseId === wh.warehouseLocationId
                      ? "border-blue-500 bg-blue-50/50 shadow-sm"
                      : "border-gray-100 hover:border-gray-200 bg-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        selectedWarehouseId === wh.warehouseLocationId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      <Warehouse className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {wh.warehouseName}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {wh.warehouseCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border",
                        selectedWarehouseId === wh.warehouseLocationId
                          ? "bg-white text-green-600 border-transparent"
                          : "bg-green-50 text-green-700 border-green-100",
                      )}
                    >
                      Có sẵn {wh.items?.length || 0} Sản phẩm phù hợp
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: CHI TIẾT SẢN PHẨM TRONG KHO */}
          <section className="space-y-3 min-h-[200px]">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                  <Box className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                    Chi tiết tồn kho thực tế
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Hãy chọn một kho để xem chi tiết
                  </p>
                </div>
              </div>
            </div>

            {!selectedWarehouse ? (
              <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-gray-400 bg-gray-50">
                <Package className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm italic">
                  Chọn một kho bên trên để xem chi tiết
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr>
                      <th className="px-4 py-2 font-medium">Sản phẩm</th>
                      <th className="px-4 py-2 font-medium">Màu</th>
                      <th className="px-4 py-2 font-medium text-right">
                        Số lượng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedWarehouse.items.map(
                      (item: RefillRequestProductColor, idx: number) => (
                        <tr
                          key={idx}
                          className="hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-700">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <Image
                                  src={
                                    item.imageUrl || "/placeholder-product.png"
                                  }
                                  alt={item.productName as string}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              <div>
                                <div className="text-sm font-semibold">
                                  {item.productName}
                                </div>
                                <p className="text-[10px] text-gray-400 font-mono">
                                  {item.sku}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 border font-bold">
                              {formatColorNameToVN(item?.color as string)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={cn(
                                "font-bold",
                                item?.availableQuantity || 0 > 0
                                  ? "text-emerald-600"
                                  : "text-red-500",
                              )}
                            >
                              {item.availableQuantity}
                            </span>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <DialogFooter className="p-6 pt-2 gap-3 bg-gray-50 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-lg border-gray-300"
          >
            Huỷ bỏ
          </Button>
          <Button
            disabled={isLoading || !selectedWarehouseId}
            onClick={onSubmit}
            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Xác nhận điều phối
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AssignWarehouseModal);
