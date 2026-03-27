import { Eye } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { getOrderDetailAPI } from "../services/order.service";
import { useQuery } from "@tanstack/react-query";
import { Order } from "../types";

type OrderViewDetailSheetProps = {
  orderCode: number | null;
  isOpen: boolean;
  onClose: () => void;
};

function OrderViewDetailSheet({
  orderCode,
  isOpen,
  onClose,
}: OrderViewDetailSheetProps) {
  const { data: orderDetail = [] } = useQuery({
    queryKey: ["order", orderCode!],
    queryFn: () => getOrderDetailAPI(orderCode!),
    select: (res) => res.data as Order[],
    enabled: !!orderCode,
  });

  if (!orderCode) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full !max-w-[800px]">
        <SheetHeader>
          <SheetTitle>Thông tin đơn hàng</SheetTitle>
          <SheetDescription>Thông tin về đơn hàng</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default OrderViewDetailSheet;
