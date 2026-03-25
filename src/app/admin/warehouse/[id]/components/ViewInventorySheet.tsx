"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";

import { Button } from "@/src/styles/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getInventoryOfWarehouseByIdAPI } from "@/src/services/inventory.service";

type ViewInventorySheetProps = {
  warehouseId: string;
};

function ViewInventorySheet({ warehouseId }: ViewInventorySheetProps) {
  const { data: warehouseInventoryList, isLoading } = useQuery({
    queryKey: ["warehouseInventories", warehouseId!],
    queryFn: () => getInventoryOfWarehouseByIdAPI(warehouseId!),
    select: (res) => res.data.products,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="text-xs">
          Chi tiết
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full !max-w-[800px]">
        <SheetHeader className="pb-0">
          <SheetTitle className="">
            <h1 className="text-xl">Danh sách hàng tồn kho</h1>
          </SheetTitle>
        </SheetHeader>

      </SheetContent>
    </Sheet>
  );
}

export default ViewInventorySheet;
