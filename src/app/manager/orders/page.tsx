"use client";

import { useAuth } from "@/src/hooks/useAuth";
import useQueryParams from "@/src/hooks/useQueryParams";
import { getAllOrdersAPI } from "@/src/services/order.service";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getOrderColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function StoreManageOrders() {
  const { myStore } = useAuth();
  const storeId = myStore?.storeId;

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>(
    {
      storeId: storeId,
      searchTerm: "",
      fromDate: "",
      toDate: "",
      status: "",
    },
    {
      excludeResetKeys: ["storeId"],
    },
  );

  const {
    data: orderList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", query],
    queryFn: () => getAllOrdersAPI(query),
    select: (res) => res.data,
    enabled: !!query.storeId,
  });

  const columns = getOrderColumns();

  if (!query.storeId) {
    return <LoadingPageComponent />;
  }
  return (
    <>
      {/*Header */}
      <div className="">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Giám sát đơn bán hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách đơn bán hàng của cửa hàng
          </p>
        </div>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={orderList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={orderList.length}
              onSearch={(val) => updateQuery({ searchTerm: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />
          </div>
        </DataTable>
      </div>
    </>
  );
}
