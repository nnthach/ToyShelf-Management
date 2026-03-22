"use client";

import { Download, Plus, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { RefillRequest } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillRequestColumns } from "./columns";
import { useState } from "react";
import { getAllRefillAPI } from "@/src/services/refill.service";
import ViewRefillRequestModalDetail from "./components/ViewRefillRequestDetailModal";
import { useRouter } from "next/navigation";
import CreateRefillOrderModal from "./components/CreateRefillOrderModal";

export default function ManagerRefillRequestManage() {
  const router = useRouter();

  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
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

  const handleEdit = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const columns = getStoreRefillRequestColumns(handleEdit);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Yêu cầu bổ sung hàng</h1>
        <CreateRefillOrderModal />
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
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />

            <div className="space-x-3">
              <Button>
                <Download /> Nhập khẩu
              </Button>
              <Button variant={"outline"}>
                <Upload /> Xuất khẩu
              </Button>
            </div>
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
