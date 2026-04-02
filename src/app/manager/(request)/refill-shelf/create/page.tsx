"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import { QueryParams } from "@/src/types/SubType";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FilterSearch from "./components/FilterSearch";
import CartDetailSheet from "./components/CartDetailSheet";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";
import Pagination from "@/src/components/Pagination";
import { Shelf } from "@/src/types";
import { createRefillAPI } from "@/src/services/refill.service";
import { toast } from "react-toastify";
import { getAllShelfTypeAPI } from "@/src/services/shelf.service";
import ShelfCardOrder from "./components/ShelfCardOrder";

export interface CartItem {
  shelfTypeId: string;
  quantity: number;
  name: string;
  image: string;
  description: string;
  totalLevels: number;
  width: number;
  depth: number;
  height: number;
}

export default function CreateStoreOrderRefillShelf() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [cart, setCart] = useState<CartItem[]>([]);

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    searchItem: "",
    categoryId: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const {
    data: shelfList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shelfTypes", query],
    queryFn: () => getAllShelfTypeAPI(query),
    select: (res) => res.data,
  });

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.shelfTypeId === item.shelfTypeId);

      if (exist) {
        return prev.map((i) =>
          i.shelfTypeId === item.shelfTypeId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (shelfTypeId: string) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.shelfTypeId === shelfTypeId);

      if (!exist) return prev;

      if (exist.quantity === 1) {
        return prev.filter((i) => i.shelfTypeId !== shelfTypeId);
      }

      return prev.map((item) =>
        item.shelfTypeId === shelfTypeId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  const onSubmit = async () => {
    const payload = {
      items: cart.map((item) => ({
        shelfTypeId: item.shelfTypeId,
        quantity: item.quantity,
      })),
    };

    try {
      await createRefillAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["refillRequests"],
      });

      toast.success("Tạo đơn thành công");
      router.back();
    } catch (error) {
      toast.error("Tạo đơn thất bại");
    }
  };
  return (
    <>
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
            Tạo đơn đặt hàng
          </h1>
        </div>
        <CartDetailSheet
          cart={cart}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
          onSubmit={onSubmit}
        />
      </div>

      {/*main content */}
      <div className="container mx-auto py-10">
        <div className="bg-white rounded-xl overflow-hidden pb-4">
          <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar">
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={shelfList.totalCount}
              onSearch={(val) => updateQuery({ searchItem: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                  pageNumber: 1,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />{" "}
          </div>

          <div className="px-4 pb-4">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : shelfList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {shelfList.map((shelfType: Shelf) => (
                  <ShelfCardOrder
                    key={shelfType.id}
                    shelf={shelfType}
                    handleAddToCart={handleAddToCart}
                    handleRemoveFromCart={handleRemoveFromCart}
                    cart={cart}
                  />
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-300 text-lg font-medium">
                Không có sản phẩm nào
              </div>
            )}
          </div>

          <Pagination
            currentPage={query?.pageNumber || 1}
            totalItems={shelfList.totalCount}
            totalPages={shelfList.totalPages}
            pageSize={query?.pageSize || 10}
            onPageChange={(page) => updateQuery({ pageNumber: page })}
          />
        </div>
      </div>
    </>
  );
}
