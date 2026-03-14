"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { getAllProductAPI } from "@/src/services/product.service";
import { Input } from "@/src/styles/components/ui/input";
import { Checkbox } from "@/src/styles/components/ui/checkbox";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import { Separator } from "@/src/styles/components/ui/separator";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ProductOrderCard from "./components/ProductOrderCard";
import { Product } from "@/src/types";
import SidebarFilter from "./components/SidebarFilter";
import CartDetailSheet from "./components/CartDetailSheet";
import { paymentCheckoutAPI } from "@/src/services/payment.service";
import { useAuth } from "@/src/hooks/useAuth";

type CartItem = {
  productColorId: string;
  quantity: number;
};

export default function StoreOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { user } = useAuth();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
    brand: "",
  });

  const {
    data: productList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", query],
    queryFn: () => getAllProductAPI(query),
    select: (res) => res.data,
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (productColorId: string) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.productColorId === productColorId);

      if (exist) {
        return prev.map((item) =>
          item.productColorId === productColorId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { productColorId, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productColorId: string) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.productColorId === productColorId);

      if (!exist) return prev;

      if (exist.quantity === 1) {
        return prev.filter((i) => i.productColorId !== productColorId);
      }

      return prev.map((item) =>
        item.productColorId === productColorId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  const handleCheckout = async () => {
    const payload = {
      storeId: id,
      staffId: user?.id,
      items: cart,
    };
    console.log("payload", payload);
    try {
      const res = await paymentCheckoutAPI(payload);
      console.log("res", res.checkoutUrl);

      const checkoutUrl = res?.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.log("checkout err", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* SIDEBAR BÊN TRÁI */}
      <SidebarFilter
        query={query}
        updateQuery={updateQuery}
        resetQuery={resetQuery}
      />

      {/* NỘI DUNG SẢN PHẨM BÊN PHẢI */}
      <main className="flex-1 flex flex-col">
        {/* Header nhỏ cho vùng sản phẩm (nếu cần) */}
        <header className="h-16 border-b flex items-center px-8 justify-between bg-background/95 backdrop-blur">
          <h1 className="text-xl font-bold">Sản phẩm ({productList.length})</h1>
          {/* Sort dropdown có thể đặt ở đây */}

          <CartDetailSheet
            cart={cart}
            products={productList}
            onAdd={handleAddToCart}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
          />
        </header>

        {/* Vùng cuộn sản phẩm */}
        <ScrollArea className="flex-1">
          <div className="p-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Skeleton Loading ở đây */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productList.map((product: Product) => (
                  <ProductOrderCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
