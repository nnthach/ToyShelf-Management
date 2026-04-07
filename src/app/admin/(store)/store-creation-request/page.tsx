"use client";

import { Download, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { Store } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreCreateRequestColumns } from "./columns";
import {
  deleteStoreCreationRequestAPI,
  getAllStoreCreationRequestAPI,
} from "@/src/services/store-create-request.service";
import { toast } from "react-toastify";
import { useState } from "react";
import UpdateStoreCreateRequestModal from "./components/UpdateStoreCreationRequestModal";

export default function AdminStoreCreationRequestManage() {
  const queryClient = useQueryClient();

  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const {
    data: storeCreateRequestList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["storeRequests", query],
    queryFn: () => getAllStoreCreationRequestAPI(query),
    select: (res) => res.data as Store[],
  });

  const handleEdit = (cityId: string) => {
    setSelectedRequestId(cityId);
  };

  const columns = getStoreCreateRequestColumns( handleEdit);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý yêu cầu tạo cửa hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách yêu cầu tạo cửa hàng trong hệ thống
          </p>
        </div>{" "}
      </div>

      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={storeCreateRequestList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={storeCreateRequestList.length}
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
        <UpdateStoreCreateRequestModal
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
