"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { DamageReport, Partner, Store } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreReturnRequestColumn } from "./columns";
import { useState } from "react";
import { getAllDamageReportAPI } from "@/src/services/damage-report.service";
import UpdateReturnRequestModal from "./components/UpdateReturnRequestModal";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { getAllStoreAPI } from "@/src/services/store.service";

export default function AdminReturnRequestManage() {
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    storeId: "",
    partnerId: "",
  });

  const {
    data: returnRequestList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["returnRequests", query],
    queryFn: () => getAllDamageReportAPI(query),
    select: (res) => res.data as DamageReport[],
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

  const columns = getStoreReturnRequestColumn(handleEdit);

  return (
    <>
      {/*Header */}
      <div className="">
        <h1 className="text-2xl font-bold dark:text-foreground">
          Quản lý trả hàng từ cửa hàng
        </h1>
        <p className="text-gray-500 dark:text-gray-200">
          Danh sách tất cả các đơn trả hàng trong hệ thống
        </p>
      </div>

      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={returnRequestList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              storeList={storeList}
              partnerList={partnerList}
              resultCount={returnRequestList.length}
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
        <UpdateReturnRequestModal
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
