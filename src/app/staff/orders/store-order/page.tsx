"use client";

import React, { useState } from "react";
import ProductOrderCard from "./components/ProductOrderCard";
import { Product, RefillRequestProductColor } from "@/src/types";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import CartDetailSheet from "./components/CartDetailSheet";
import FilterSearch from "./components/FilterSearch";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/src/styles/components/ui/button";
import { paymentCheckoutAPI } from "@/src/services/payment.service";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useAuth } from "@/src/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { QueryParams } from "@/src/types/SubType";
import { getAllProductAPI } from "@/src/services/product.service";
import { getAllInventoryLocationAPI } from "@/src/services/inventory-location.service";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function StaffCreateOrder() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, myStore } = useAuth();

  const [cart, setCart] = useState<RefillRequestProductColor[]>([]);

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

  // get store location id by inventoryLocationAPI
  const { data: storeLocationId = [] } = useQuery({
    queryKey: ["storeLocations", { storeId: myStore?.storeId }],
    queryFn: () => getAllInventoryLocationAPI({ storeId: myStore?.storeId }),
    select: (res) => res.data,
  });

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

  const handleSubmit = async () => {
    const payload = {
      storeId: myStore?.storeId,
      staffId: user?.id,
      items: cart,
    };
    console.log("payload", payload);
    // try {
    //   const res = await paymentCheckoutAPI(payload);
    //   console.log("res", res.checkoutUrl);

    //   const checkoutUrl = res?.checkoutUrl;

    //   if (checkoutUrl) {
    //     window.location.href = checkoutUrl;
    //   }
    // } catch (error) {
    //   console.log("checkout err", error);
    // }
  };

  return (
    <>
      {isLoading && <LoadingPageComponent />}

      {/*Header */}
      <div className="flex items-center justify-between">
        {/*Left */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => router.back()}
            className="w-8 h-8"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-bold dark:text-foreground">
            Tạo đơn hàng
          </h1>
        </div>
        {/*Right */}
        <Button
          type="submit"
          className="btn-primary-gradient"
          form="form-create-product"
        >
          <Check />
          Xác nhận
        </Button>
      </div>

      <header className="h-16 border-b flex items-center px-8 justify-between bg-background/95 backdrop-blur">
        <FilterSearch
          query={query}
          loading={isLoading}
          resultCount={productList.length}
          onSearch={(val) => updateQuery({ search: val })}
          onApplyFilter={(filter) =>
            updateQuery({
              ...filter,
            })
          }
          onReset={() => resetQuery()}
          onRefresh={() => refetch()}
        />
        {/* Sort dropdown có thể đặt ở đây */}

        <CartDetailSheet
          cart={cart}
          products={productList}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
          onCheckout={handleSubmit}
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
    </>
  );
}
