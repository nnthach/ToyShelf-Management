"use client";

import Pagination from "@/src/components/Pagination";
import { getInventoryOfWarehouseByIdAPI } from "@/src/services/inventory.service";
import { Button } from "@/src/styles/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import FilterSearch from "./components/FilterSearch";
import useQueryParams from "@/src/hooks/useQueryParams";
import { QueryParams } from "@/src/types/SubType";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";
import { Product } from "@/src/types";
import ProductCardWithQuantity from "@/src/components/ProductCardWithQuantity";

export default function AdminViewWarehouseInventory() {
  const { id: warehouseId } = useParams<{ id: string }>();
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
    data: warehouseInventories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["warehouseInventories", warehouseId],
    queryFn: () => getInventoryOfWarehouseByIdAPI(warehouseId!),
    select: (res) => res.data,
    enabled: !!warehouseId,
  });

  const handleViewDetail = () => {};

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
            Hàng tồn kho của kho {warehouseInventories?.warehouseName}
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
              resultCount={warehouseInventories?.products.length}
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
            ) : warehouseInventories?.products?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {warehouseInventories?.products?.map(
                  (product: Product) => (
                    <ProductCardWithQuantity
                      key={product.productId}
                      product={product}
                      handleViewDetail={handleViewDetail}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-300 text-lg font-medium">
                Không có sản phẩm nào
              </div>
            )}
          </div>

          <Pagination
            currentPage={query?.pageNumber || 1}
            totalPages={warehouseInventories?.products?.totalPages || 0}
            onPageChange={(page) => updateQuery({ pageNumber: page })}
          />
        </div>
      </div>
    </>
  );
}
