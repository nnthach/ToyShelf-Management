"use client";

import { Download, Plus, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { RefillRequest } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillShelfRequestColumns } from "./columns";
import { useState } from "react";
import { getAllRefillAPI } from "@/src/services/refill.service";
import ViewRefillRequestModalDetail from "./components/ViewRefillShelfRequestDetailModal";
import { useRouter } from "next/navigation";
import { getAllRefillShelfAPI } from "@/src/services/refill-shelf.service";
import CreateReturnModal from "./components/CreateReturnModal";

export default function ManagerReturnRequestManage() {
  const router = useRouter();

  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
    status: "",
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý trả hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các đơn trả hàng của cửa hàng
          </p>
        </div>
        <CreateReturnModal />
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
