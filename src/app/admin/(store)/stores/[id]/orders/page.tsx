"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { getOrderColumns } from "./components/columns";
import useQueryParams from "@/src/hooks/useQueryParams";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { getAllOrdersAPI } from "@/src/services/order.service";
import { Button } from "@/src/styles/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FilterSearch from "./components/FilterSearch";

export default function AdminViewStoreOrder() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    storeId: id,
    phone: "",
  });

  const {
    data: orderList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", query],
    queryFn: () => getAllOrdersAPI(query),
    select: (res) => res.data,
  });

  const columns = getOrderColumns();

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
            Danh sách đơn hàng của cửa hàng
          </h1>
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
              onSearch={(val) => updateQuery({ phone: val })}
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
