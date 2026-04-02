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
import React, { memo, useState } from "react";
import { Badge } from "@/src/styles/components/ui/badge";

type CartDetailSheetProps = {
  cart: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (productColorId: string) => void;
  onSubmit: (note: string) => void;
};

function CartDetailSheet({
  cart,
  onAdd,
  onRemove,
  onSubmit,
}: CartDetailSheetProps) {
  const [note, setNote] = useState("");

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
            Kệ đặt hàng
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p>Chưa có kệ nào</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.shelfTypeId}
                className="flex gap-3 bg-white border p-3 rounded-xl shadow-sm items-center"
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border shrink-0">
                  <Image
                    src={item.image || "/images/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <h4 className="text-sm font-bold line-clamp-1 text-gray-900">
                    {item.name}
                  </h4>

                  {/* Hiển thị kích thước */}
                  <p className="text-[11px] text-gray-500">
                    Kích thước:{" "}
                    <span className="font-medium text-gray-700">
                      {item.width} × {item.depth} × {item.height}
                    </span>
                  </p>

                  <div className="flex">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-5 bg-blue-50 text-blue-700 border-blue-100 font-bold uppercase"
                    >
                      {item.totalLevels} Tầng
                    </Badge>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 hover:bg-white hover:shadow-sm transition-all"
                    onClick={() => onRemove(item.shelfTypeId)}
                  >
                    <Minus size={14} />
                  </Button>

                  <span className="text-sm font-bold w-6 text-center">
                    {item.quantity}
                  </span>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 hover:bg-white hover:shadow-sm transition-all"
                    onClick={() => onAdd(item)}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 pt-2 border-t ">
          {/* Note input */}
          <div className=" mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Ghi chú
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú cho đơn hàng..."
              className="w-full text-sm px-3 py-2 mt-1 rounded-xl border border-gray-400 bg-white resize-none outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all placeholder:text-gray-300"
            />
          </div>
          <button
            onClick={() => onSubmit(note)}
            disabled={cart.length === 0}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-black text-white font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit size={18} />
            Tạo đơn đặt hàng
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(CartDetailSheet);
