"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { RefillRequest, Store } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillRequestColumns } from "./columns";
import { useState } from "react";
import FilterSearch from "./components/FilterSearch";
import { getAllStoreAPI } from "@/src/services/store.service";
import ViewRefillShelfRequestModalDetail from "./components/ViewRefillShelfRequestDetailModal";
import { getAllRefillShelfAPI } from "@/src/services/refill-shelf.service";

export default function PartnerRefillShelfRequestManage() {
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    order: "",
    storeId: "",
  });

  const {
    data: refillShelfRequestList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["refillShelfRequests", query],
    queryFn: () => getAllRefillShelfAPI(query),
    select: (res) => res.data as RefillRequest[],
  });

  const { data: storeList } = useQuery({
    queryKey: ["stores"],
    queryFn: () => getAllStoreAPI({}),
    select: (res) => res.data as Store[],
  });

  const handleEdit = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const columns = getStoreRefillRequestColumns(handleEdit);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý đặt kệ
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các đơn đặt kệ từ cửa hàng
          </p>
        </div>
      </div>

      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={refillShelfRequestList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={refillShelfRequestList.length}
              storeList={storeList}
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

      {selectedRequestId && (
        <ViewRefillShelfRequestModalDetail
          requestId={selectedRequestId}
          isOpen={!!selectedRequestId}
          onClose={() => {
            setSelectedRequestId("");
          }}
        />
      )}
    </>
  );
}
