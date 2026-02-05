import { ProductColor } from "@/src/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../../styles/components/ui/sheet";
import { Eye } from "lucide-react";

function ViewDetailSheet({ productColor }: { productColor: ProductColor }) {
  return (
    <Sheet>
      <SheetTrigger>
        <span title="Detail" className="cursor-pointer text-blue-400">
          <Eye />
        </span>
      </SheetTrigger>
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>Chi tiết màu sắc sản phẩm</SheetTitle>
          <SheetDescription>
            Xem chi tiết màu sắc sản phẩm <b>{productColor.name}</b>
          </SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Right */}
          <div className="bg-background flex-1 border-t border-border">
            <div className="flex flex-col divide-y divide-border">
              {/* Full name */}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tên màu sắc sản phẩm
                </p>
                <p className="text-base font-bold">{productColor.name}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
