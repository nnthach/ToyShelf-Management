"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";
import { Box, ShoppingCart, Plus, Minus, Edit } from "lucide-react";
import { Button } from "@/src/styles/components/ui/button";
import Image from "next/image";
import { CartItem } from "../page";
import React from "react";

type CartDetailSheetProps = {
  cart: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (productColorId: string) => void;
  onSubmit: () => void;
};

function CartDetailSheet({
  cart,
  onAdd,
  onRemove,
  onSubmit,
}: CartDetailSheetProps) {
  const totalQuantity = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-1">
          <ShoppingCart className="w-4 h-4" />
          <span>Giỏ hàng</span>
          <span className="text-muted-foreground">({totalQuantity})</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-[450px] p-0 flex flex-col h-full">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            Sản phẩm đặt hàng
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p>Chưa có sản phẩm nào</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productColorId}
                className="flex gap-3 bg-white border p-3 rounded-xl shadow-sm"
              >
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-50 border shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 items-center">
                    <h4 className="text-sm font-bold line-clamp-1">
                      {item.name}
                    </h4>

                    {/* Category Name */}
                    <div className="mb-1">
                      <span className="inline-flex items-center bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {item.categoryName || "Danh mục"}
                      </span>
                    </div>
                  </div>

                  {/* Color Name & SKU */}
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-3 h-3 rounded-full border shrink-0"
                      style={{ backgroundColor: item.hexcode }}
                    />
                    <span className="text-[11px] text-gray-600 font-medium">
                      {item.colorName}
                    </span>
                    <span className="text-[11px] text-gray-400">|</span>
                    <span className="text-[11px] text-gray-600 uppercase">
                      {item.sku}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold text-zinc-900">
                      {item.price.toLocaleString()}đ
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-7 h-7 rounded-lg"
                        onClick={() => onRemove(item.productColorId)}
                      >
                        <Minus size={14} />
                      </Button>

                      <span className="text-sm font-bold w-6 text-center">
                        {item.quantity}
                      </span>

                      <Button
                        size="icon"
                        variant="outline"
                        className="w-7 h-7 rounded-lg"
                        onClick={() => onAdd(item)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t bg-gray-50/50">
          <button
            onClick={onSubmit}
            disabled={cart.length === 0}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-black text-white font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            <Edit size={18} />
            Tạo đơn đặt hàng
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CartDetailSheet;
