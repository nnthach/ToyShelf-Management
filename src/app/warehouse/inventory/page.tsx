"use client";

import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import CreateInventoryModal from "./components/CreateInventoryModal";
import { getInventoryOfWarehouseByIdAPI } from "@/src/services/inventory.service";
import ProductGridView from "./components/ProductGridView";
import { useState } from "react";

export default function WarehouseInventoryManage() {
  const [selectedProductId, setSelectProductId] = useState<string | null>(null);

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const {
    data: productInventoryList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["inventories", query],
    queryFn: () =>
      getInventoryOfWarehouseByIdAPI("d2f2e652-ad54-44a0-b6e4-6447d449ca1a"),
    select: (res) => res.data.products,
  });

  const handleViewDetail = (productId: string) => {
    setSelectProductId(productId);
  };

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý hàng tồn kho</h1>
        <CreateInventoryModal />
      </div>
      <ProductGridView
        productList={productInventoryList.items ?? []}
        isLoading={isLoading}
        handleViewDetail={handleViewDetail}
        query={query}
        updateQuery={updateQuery}
        totalItems={productInventoryList.totalCount}
      >
        <FilterSearch
          query={query}
          loading={isLoading}
          resultCount={productInventoryList.totalCount}
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
      </ProductGridView>
    </>
  );
}
