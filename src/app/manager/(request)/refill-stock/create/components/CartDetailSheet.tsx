"use client";

import { Product } from "@/src/types";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";
import { Button } from "@/src/styles/components/ui/button";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";

type CartItem = {
  productColorId: string;
  quantity: number;
};

type Props = {
  cart: CartItem[];
  products: Product[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
};

export default function CartDetailSheet({
  cart,
  products,
  onAdd,
  onRemove,
  onCheckout,
}: Props) {
  const cartItems = cart.map((item) => {
    const product = products.find((p) =>
      p.colors.some((c) => c.id === item.productColorId),
    );

    const color = product?.colors.find((c) => c.id === item.productColorId);

    return {
      product,
      color,
      quantity: item.quantity,
    };
  });

  console.log("cart item", cartItems);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ShoppingCart size={18} />
          Giỏ hàng ({totalQuantity})
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[420px] sm:w-[520px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Giỏ hàng ({totalQuantity})</SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <ScrollArea className="flex-1 mt-4 px-2">
          <div className="flex flex-col gap-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-center border rounded-lg p-3"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={item.color?.imageUrl || ""}
                    alt={item.product?.name || ""}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.product?.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {item.color?.price.toLocaleString()}đ
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onRemove(item.color!.id)}
                    >
                      <Minus size={10} />
                    </Button>

                    <span className="text-sm font-medium">{item.quantity}</span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onAdd(item.color!.id)}
                    >
                      <Plus size={10} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="border-t pt-4">
          <div className="w-full">
            <div className="flex justify-between font-semibold text-lg mb-3">
              <span>Tổng sản phẩm</span>
              <span>{totalQuantity}</span>
            </div>

            <Button className="w-full" onClick={onCheckout}>
              Tạo yêu cầu
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
