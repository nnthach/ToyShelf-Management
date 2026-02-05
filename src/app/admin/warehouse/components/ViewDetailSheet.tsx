"use client";

import { Card, CardHeader, CardTitle } from "@/src/styles/components/ui/card";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { DollarSign, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import WarehouseFormSheet from "./WarehouseFormSheet";
import { getWarehouseDetailAPI } from "@/src/services/warehouse.service";
import { formatUserStatusColor } from "@/src/utils/formatStatus";

type ViewDetailSheetProps = {
  warehouseId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({
  warehouseId,
  isOpen,
  onClose,
}: ViewDetailSheetProps) {
  const { data: warehouseDetail, isLoading } = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () => getWarehouseDetailAPI(warehouseId!),
    select: (res) => res.data,
    enabled: !!warehouseId,
  });

  if (!warehouseId) return null;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>
            thông tin kho hàng{" "}
            <span
              className={`text-sm pb-1 ${formatUserStatusColor(warehouseDetail?.isActive)}`}
            >
              {warehouseDetail?.isActive ? "Hoạt động" : "Không hoạt động"}
            </span>
          </SheetTitle>
          <SheetDescription>
            xem chi tiết thông tin kho hàng {warehouseDetail?.name}
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
                      <p className="text-primary text-lg">Tổng đơn hàng</p>
                    </div>

                    <p className="text-xl font-bold text-primary">7 đơn</p>
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
                      <p className="text-primary text-lg">Tổng chi tiêu</p>
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
                  Đơn hàng gần đây <span className="text-gray-500">(9)</span>
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

                      {/* Trạng thái */}
                      <span className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-700">
                        Hoạt động
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/*Right */}
          <WarehouseFormSheet warehouse={warehouseDetail} onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
