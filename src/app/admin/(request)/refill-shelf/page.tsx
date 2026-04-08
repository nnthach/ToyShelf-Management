"use client";

import { Download, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { RefillRequest } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillShelfRequestColumns } from "./columns";
import { useState } from "react";
import { getAllRefillAPI } from "@/src/services/refill.service";
import UpdateRefillShelfRequestModal from "./components/UpdateRefillRequestModal";
import { getAllRefillShelfAPI } from "@/src/services/refill-shelf.service";

export default function AdminRefillShelfRequestManage() {
  const queryClient = useQueryClient();

  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
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
              resultCount={refillShelfRequestList.length}
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
