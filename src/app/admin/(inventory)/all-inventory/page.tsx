"use client";

import Pagination from "@/src/components/Pagination";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";
import ProductCardWithQuantity from "@/src/components/ProductCardWithQuantity";
import { InventoryLocation, Product } from "@/src/types";
import React, { useEffect } from "react";
import FilterSearch from "./components/FilterSearch";
import { getInventoryByLocationIdAPI } from "@/src/services/inventory.service";
import { useQuery } from "@tanstack/react-query";
import useQueryParams from "@/src/hooks/useQueryParams";
import { QueryParams } from "@/src/types/SubType";
import { getAllInventoryLocationAPI } from "@/src/services/inventory-location.service";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/src/styles/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminViewAllInventory() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const storeId = searchParams.get("storeId");
  const router = useRouter();

  const { data: locationList } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllInventoryLocationAPI({}),
    select: (res) => res.data as InventoryLocation[],
  });

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    locationId: "",
    categoryId: "",
    pageNumber: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (locationList?.length && !query.locationId) {
      updateQuery({
        locationId: locationList[0].id,
      });
    }
  }, [locationList]);

  const {
    data: inventoryList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["inventories", query.locationId],
    queryFn: () => getInventoryByLocationIdAPI(query.locationId!),
    select: (res) => res.data,
    enabled: !!query.locationId,
  });

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          {from === "store" && storeId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/stores/${storeId}`)}
              className="w-8 h-8"
            >
              <ArrowLeft />
            </Button>
          )}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold dark:text-foreground">
              Giám xác hàng tồn kho tại {inventoryList?.locationName}
            </h1>
            <p className="text-gray-500 dark:text-gray-200">
              Danh sách sản phẩm tồn kho tại cửa hàng và kho
            </p>
          </div>
        </div>
      </div>

      {/*main content */}
      <div className="container mx-auto py-10">
        <div className="bg-white rounded-xl overflow-hidden pb-4">
          <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar">
            <FilterSearch
              query={query}
              loading={isLoading}
              locationList={locationList}
              resultCount={inventoryList?.products.length}
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
            ) : inventoryList?.products?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {inventoryList?.products?.map((product: Product) => (
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
            totalPages={inventoryList?.products?.totalPages || 0}
            onPageChange={(page) => updateQuery({ pageNumber: page })}
          />
        </div>
      </div>
    </>
  );
}
