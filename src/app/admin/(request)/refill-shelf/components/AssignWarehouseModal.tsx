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
import { Send, Warehouse, Box, Package, Pencil } from "lucide-react";
import { memo, useState, useMemo } from "react";
import { createShipmentAssignWarehouseAPI } from "@/src/services/shipment-assignment.service";
import { RefillShelfRequestItem } from "@/src/types";
import { cn } from "@/src/styles/lib/utils";
import Image from "next/image";
import { getShelfOrderAvailableWarehouseAPI } from "@/src/services/refill-shelf.service";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

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
  items: RefillShelfRequestItem[];
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
  const [assignQuantities, setAssignQuantities] = useState<
    Record<string, number | "">
  >({});

  const {
    data: availableWarehouseList,
    isLoading: isLoadingAvailableWarehouse,
  } = useQuery({
    queryKey: ["availableWarehouses", requestId],
    queryFn: () => getShelfOrderAvailableWarehouseAPI(requestId),
    select: (res) => res.data,
    enabled: isOpen,
  });

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

    const payload = {
      warehouseLocationId: selectedWarehouseId,
      shelfOrderId: requestId,
      shelfItems: Object.entries(assignQuantities)
        .filter(([_, qty]) => Number(qty) > 0)
        .map(([itemId, qty]) => ({ itemId, quantity: Number(qty) })),
    };
    try {
      await createShipmentAssignWarehouseAPI(payload);

      queryClient.invalidateQueries({ queryKey: ["requestDetail", requestId] });
      queryClient.invalidateQueries({ queryKey: ["shipmentAssigns"] });

      toast.success("Điều phối kho thành công");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Điều phối kho thất bại"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setSelectedWarehouseId(null);
          setAssignQuantities({});
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
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

        {/*Main content */}
        <div className="grid grid-cols-5 flex-1 min-h-0 overflow-hidden">
          {/*thông tin kho */}
          <div className="flex flex-col col-span-2 gap-4 min-h-0 px-6 border-r border-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
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
            {/* DANH SÁCH - Đây là phần quan trọng nhất */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 max-h-[410px] pr-2 space-y-3 bg-slate-100 p-2 rounded-xl">
              {availableWarehouseList?.map((wh: WarehouseInventory) => (
                <div
                  key={wh.warehouseId}
                  onClick={() => {
                    setSelectedWarehouseId(wh.warehouseLocationId);
                    setAssignQuantities({});
                  }}
                  className={cn(
                    "cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between",
                    selectedWarehouseId === wh.warehouseLocationId
                      ? "border-blue-500 bg-blue-50/50 shadow-sm"
                      : "border-gray-100 hover:border-gray-200 bg-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-bold text-sm text-gray-900">
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
                      {wh.items?.length || 0} kệ phù hợp
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col col-span-3 gap-4 overflow-y-auto h-[470px] px-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Pencil className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Nhập số lượng giao
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  Chỉ định số lượng từng loại kệ kho sẽ giao
                </p>
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
              <>
                <div className="rounded-xl border border-gray-100 overflow-y-auto custom-scrollbar bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-gray-50/80 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b">
                        <tr>
                          <th className="px-4 py-2 font-medium">Kệ</th>
                          <th className="px-2 py-3 text-center bg-gray-100/50">
                            Kho
                          </th>
                          <th className="px-2 py-3 text-center">Yêu cầu</th>
                          <th className="px-2 py-3 text-center">Đã điều</th>
                          <th className="px-2 py-3 text-center text-orange-600">
                            Thiếu
                          </th>
                          <th className="px-4 py-3 text-right bg-violet-50 text-violet-700">
                            SL Giao
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedWarehouse.items.map(
                          (item: RefillShelfRequestItem) => (
                            <tr
                              key={item.shelfTypeId}
                              className="hover:bg-blue-50/30 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-gray-700">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 shrink-0 relative rounded-lg border border-gray-100 overflow-hidden">
                                    <Image
                                      src={
                                        item.imageUrl ||
                                        "/placeholder-product.png"
                                      }
                                      alt={item?.shelfTypeName || ""}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>

                                  <p className="text-sm font-semibold">
                                    {item.shelfTypeName}
                                  </p>
                                </div>
                              </td>

                              <td className="px-2 py-3 text-center font-semibold text-gray-700 bg-gray-50/30">
                                {item.availableQuantity}
                              </td>
                              <td className="px-2 py-3 text-center text-gray-600">
                                {item.originalQuantity}
                              </td>
                              <td className="px-2 py-3 text-center text-gray-600">
                                {item.fulfilledQuantity}
                              </td>
                              <td className="px-2 py-3 text-center">
                                <span
                                  className={`font-bold ${item?.remainingQuantity || 0 > 0 ? "text-red-500" : "text-gray-400"}`}
                                >
                                  {item.remainingQuantity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right bg-violet-50/30">
                                <input
                                  type="number"
                                  min={0}
                                  max={item.availableQuantity ?? 0}
                                  value={
                                    assignQuantities[item.shelfTypeId!] ?? ""
                                  }
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    const id = item.shelfTypeId!;
                                    setAssignQuantities((prev) => ({
                                      ...prev,
                                      [id]:
                                        raw === ""
                                          ? ""
                                          : Math.min(
                                              Math.max(0, Number(raw)),
                                              item.availableQuantity ?? 0,
                                            ),
                                    }));
                                  }}
                                  onBlur={() => {
                                    const id = item.shelfTypeId!;
                                    if (assignQuantities[id] === "") {
                                      setAssignQuantities((prev) => ({
                                        ...prev,
                                        [id]: 0,
                                      }));
                                    }
                                  }}
                                  className="w-20 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                />
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
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
