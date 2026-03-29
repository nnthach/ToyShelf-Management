"use client";

import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import CreateInventoryModal from "./components/CreateInventoryModal";
import { getInventoryOfWarehouseByIdAPI } from "@/src/services/inventory.service";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";
import ProductCardWithQuantity from "@/src/components/ProductCardWithQuantity";
import { Product } from "@/src/types";
import Pagination from "@/src/components/Pagination";
import { useAuth } from "@/src/hooks/useAuth";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";

export default function WarehouseInventoryManage() {
  const { warehouse } = useAuth();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    searchItem: "",
    categoryId: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const {
    data: productInventoryList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["inventories", query],
    queryFn: () =>
      getInventoryOfWarehouseByIdAPI(warehouse?.warehouseId as string, query),
    select: (res) => res.data,
    enabled: !!warehouse?.warehouseId,
  });

  const { data: categoryList } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllProductCategoryAPI({}),
    select: (res) => res.data,
  });

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý hàng tồn kho</h1>
        <CreateInventoryModal />
      </div>
      {/*main content */}
      <div className="container mx-auto py-10">
        <div className="bg-white rounded-xl overflow-hidden pb-4">
          <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar">
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={productInventoryList?.totalCount}
              categoryList={categoryList}
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
            ) : productInventoryList?.products?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {productInventoryList?.products?.map((product: Product) => (
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
            totalPages={productInventoryList?.totalPages || 1}
            totalItems={productInventoryList?.totalCount}
            pageSize={query?.pageSize || 10}
            onPageChange={(page) => updateQuery({ pageNumber: page })}
          />
        </div>
      </div>
    </>
  );
}
