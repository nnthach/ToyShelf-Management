"use client";
import useQueryParams from "@/src/hooks/useQueryParams";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { Partner, RefillRequest, Store } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillRequestColumns } from "./columns";
import { useState } from "react";
import { getAllRefillAPI } from "@/src/services/refill.service";
import UpdateRefillRequestModal from "./components/UpdateRefillRequestModal";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { getAllStoreAPI } from "@/src/services/store.service";

export default function AdminRefillRequestManage() {
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    storeId: "",
    partnerId: "",
  });

  const {
    data: refillRequestList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["refillRequests", query],
    queryFn: () => getAllRefillAPI(query),
    select: (res) => res.data as RefillRequest[],
  });

  const { data: partnerList = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllPartnerAPI({}),
    select: (res) => res.data as Partner[],
  });

  const { data: storeList = [] } = useQuery({
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
      <div>
        <h1 className="text-2xl font-bold dark:text-foreground">
          Quản lý đặt hàng từ cửa hàng
        </h1>
        <p className="text-gray-500 dark:text-gray-200">
          Danh sách tất cả các đơn đặt hàng trong hệ thống
        </p>
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
              storeList={storeList}
              partnerList={partnerList}
              resultCount={refillRequestList.length}
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
        <UpdateRefillRequestModal
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
