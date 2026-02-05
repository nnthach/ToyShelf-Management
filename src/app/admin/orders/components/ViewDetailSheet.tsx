import { Eye } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";
import { Order } from "@/src/types";

function ViewDetailSheet({ order }: { order: Order }) {


  return (
    <Sheet>
      <SheetTrigger>
        <span title="Detail" className="cursor-pointer text-blue-400">
          <Eye />
        </span>
      </SheetTrigger>
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>Thông tin đơn hàng</SheetTitle>
          <SheetDescription>
            Thông tin về đơn hàng <b>{order.id}</b>
          </SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Right */}
          <div className="bg-background flex-1 border-t border-border">
            <div className="flex flex-col divide-y divide-border">
              {/* Full name */}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cửa hàng
                </p>
                <p className="text-base font-bold">{order.storeId}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
