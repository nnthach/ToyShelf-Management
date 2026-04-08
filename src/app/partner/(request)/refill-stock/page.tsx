"use client";

import { Download, Plus, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { RefillRequest } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillRequestColumns } from "./columns";
import { deleteStoreCreationRequestAPI } from "@/src/services/store-create-request.service";
import { toast } from "react-toastify";
import { useState } from "react";
import { getAllRefillAPI } from "@/src/services/refill.service";
import ViewRefillRequestModalDetail from "./components/ViewRefillRequestDetailModal";
import { useRouter } from "next/navigation";

export default function ManagerRefillRequestManage() {
  const queryClient = useQueryClient();
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
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý đặt hàng từ cửa hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các đơn đặt hàng từ các cửa hàng
          </p>
        </div>
        <Button
          className="btn-primary-gradient"
          onClick={() => router.push("/manager/refill-stock/create")}
        >
          <Plus />
          Tạo yêu cầu
        </Button>
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
