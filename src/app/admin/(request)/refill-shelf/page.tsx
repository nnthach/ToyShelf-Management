"use client";
import useQueryParams from "@/src/hooks/useQueryParams";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { Partner, RefillRequest, Store } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillShelfRequestColumns } from "./columns";
import { useState } from "react";
import UpdateRefillShelfRequestModal from "./components/UpdateRefillRequestModal";
import { getAllRefillShelfAPI } from "@/src/services/refill-shelf.service";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { getAllStoreAPI } from "@/src/services/store.service";

export default function AdminRefillShelfRequestManage() {
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    storeId: "",
    partnerId: "",
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

  const columns = getStoreRefillShelfRequestColumns(handleEdit);

  return (
    <>
      {/*Header */}
      <div className="">
        <h1 className="text-2xl font-bold dark:text-foreground">
          Quản lý đặt kệ từ cửa hàng
        </h1>
        <p className="text-gray-500 dark:text-gray-200">
          Danh sách tất cả các đơn đặt kệ trong hệ thống
        </p>
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
              storeList={storeList}
              partnerList={partnerList}
              resultCount={refillShelfRequestList.length}
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
        <UpdateRefillShelfRequestModal
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
