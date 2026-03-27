"use client";

import Pagination from "@/src/components/Pagination";
import { getInventoryByLocationIdAPI, getInventoryOfWarehouseByIdAPI } from "@/src/services/inventory.service";
import { Button } from "@/src/styles/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import FilterSearch from "./components/FilterSearch";
import useQueryParams from "@/src/hooks/useQueryParams";
import { QueryParams } from "@/src/types/SubType";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";
import { Product } from "@/src/types";
import ProductCardWithQuantity from "@/src/components/ProductCardWithQuantity";

export default function AdminViewStoreInventory() {
  const searchParams = useSearchParams();
  const inventoryLocationId = searchParams.get("inventoryLocationId");
  const router = useRouter();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    searchItem: "",
    categoryId: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const {
    data: storeInventories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["inventories", inventoryLocationId],
    queryFn: () => getInventoryByLocationIdAPI(inventoryLocationId!),
    select: (res) => res.data,
    enabled: !!inventoryLocationId,
  });

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
            Hàng tồn kho của cửa hàng {storeInventories?.locationName}
          </h1>
        </div>
      </div>

      {/*main content */}
      <div className="container mx-auto py-10">
        <div className="bg-white rounded-xl overflow-hidden pb-4">
          <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar">
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={storeInventories?.products.length}
              onSearch={(val) => updateQuery({ searchItem: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                  pageNumber: 1,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />
          </div>

          <div className="px-4 pb-4">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : storeInventories?.products?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {storeInventories?.products?.map((product: Product) => (
                  <ProductCardWithQuantity
                    key={product.productId}
                    product={product}
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
            totalPages={storeInventories?.products?.totalPages || 0}
            onPageChange={(page) => updateQuery({ pageNumber: page })}
          />
        </div>
      </div>
    </>
  );
}
