"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { RefillRequest, Store } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillRequestColumns } from "./columns";
import { useState } from "react";
import { getAllRefillAPI } from "@/src/services/refill.service";
import ViewRefillRequestModalDetail from "./components/ViewRefillRequestDetailModal";
import FilterSearch from "./components/FilterSearch";
import { getAllStoreAPI } from "@/src/services/store.service";
import { useAuth } from "@/src/hooks/useAuth";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function PartnerRefillRequestManage() {
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const { partner } = useAuth();
  const partnerId = partner?.partnerId || "";

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>(
    {
      status: "",
      storeId: "",
      partnerId: partnerId,
    },
    {
      excludeResetKeys: ["partnerId"],
    },
  );

  const {
    data: refillRequestList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["refillRequests", query],
    queryFn: () => getAllRefillAPI(query),
    select: (res) => res.data as RefillRequest[],
    enabled: !!partnerId,
  });

  const { data: storeList } = useQuery({
    queryKey: ["stores"],
    queryFn: () => getAllStoreAPI({ companyid: partnerId }),
    select: (res) => res.data as Store[],
    enabled: !!partnerId,
  });

  const handleEdit = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const columns = getStoreRefillRequestColumns(handleEdit);

  if (!partnerId) {
    return <LoadingPageComponent />;
  }
  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý đặt hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các đơn đặt hàng từ cửa hàng
          </p>
        </div>
      </div>

      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={refillRequestList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={refillRequestList.length}
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
        <ViewRefillRequestModalDetail
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
