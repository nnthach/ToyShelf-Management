"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { DamageReport } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getReturnRequestColumns } from "./columns";
import { useState } from "react";
import { getAllDamageReportAPI } from "@/src/services/damage-report.service";
import ViewReturnRequestModalDetail from "./components/ViewReturnRequestDetailModal";

export default function ManagerReturnRequestManage() {
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
    status: "",
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

  const handleEdit = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const columns = getReturnRequestColumns(handleEdit);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý trả hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các đơn trả hàng của cửa hàng
          </p>
        </div>
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
              resultCount={returnRequestList.length}
              onSearch={(val) => updateQuery({ search: val })}
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
        <ViewReturnRequestModalDetail
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
