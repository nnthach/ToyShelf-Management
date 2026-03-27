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
import { getOrderDetailAPI } from "@/src/services/order.service";
import { useQuery } from "@tanstack/react-query";

function ViewDetailSheet({ orderCode }: { orderCode: number }) {
  const { data: orderDetail = [] } = useQuery({
    queryKey: ["order", orderCode!],
    queryFn: () => getOrderDetailAPI(orderCode!),
    select: (res) => res.data as Order[],
    enabled: !!orderCode,
  });
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
          <SheetDescription>Thông tin về đơn hàng</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
