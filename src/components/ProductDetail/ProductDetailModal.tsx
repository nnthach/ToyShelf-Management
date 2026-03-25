"use client";

import { getProductDetailAPI } from "@/src/services/product.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { Product } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useState } from "react";

function ProductDetailModal({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);

  const { data: productDetail, isLoading } = useQuery({
    queryKey: ["productDetail", productId!],
    queryFn: () => getProductDetailAPI(productId!),
    select: (res) => res.data as Product,
    enabled: !!productId,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Thêm màu sắc sản phẩm
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-amber-500" />
            Chọn màu sắc chính xác để hiển thị.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6"></div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailModal;
