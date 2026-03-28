"use client";

import { useAuth } from "@/src/hooks/useAuth";
import useQueryParams from "@/src/hooks/useQueryParams";
import { getAllOrdersAPI } from "@/src/services/order.service";
import { getAllStoreAPI } from "@/src/services/store.service";
import { Store } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getOrderColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";

export default function PartnerManageOrders() {
  const searchParams = new URLSearchParams(window.location.search);
  const { partner } = useAuth();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>(
    {
      storeId: "",
      partnerId: "",
      phone: "",
    },
    {
      excludeResetKeys: ["partnerId"],
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
    enabled: !!query.partnerId,
  });

  useEffect(() => {
    if (partner?.partnerId && !searchParams.get("partnerId")) {
      updateQuery({
        partnerId: partner.partnerId,
      });
    }
  }, [partner?.partnerId]);

  const { data: storeList = [] } = useQuery({
    queryKey: ["stores", query.partnerId],
    queryFn: () =>
      getAllStoreAPI(query.partnerId ? { companyid: query.partnerId } : {}),
    select: (res) => res.data as Store[],
    enabled: !!query.partnerId,
  });

  const columns = getOrderColumns();

  return (
    <>
      {/*Header */}
      <div className="">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Giám xác đơn hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách đơn hàng của từng cửa hàng
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
              storeList={storeList}
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

            <Button variant={"outline"}>
              <Upload />
              Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>
    </>
  );
}
