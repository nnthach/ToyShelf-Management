"use client";

import { Plus } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { RefillRequest } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreRefillShelfRequestColumns } from "./columns";
import { useEffect, useState } from "react";
import ViewRefillRequestModalDetail from "./components/ViewRefillShelfRequestDetailModal";
import { useRouter } from "next/navigation";
import { getAllRefillShelfAPI } from "@/src/services/refill-shelf.service";
import { useAuth } from "@/src/hooks/useAuth";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function ManagerRefillShelfRequestManage() {
  const router = useRouter();
  const { myStore } = useAuth();
  const storeId = myStore?.storeId;

  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>(
    {
      status: "",
      storeId: storeId,
    },
    {
      excludeResetKeys: ["storeId"],
    },
  );

  const {
    data: refillShelfRequestList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["refillShelfRequests", query],
    queryFn: () => getAllRefillShelfAPI(query),
    select: (res) => res.data as RefillRequest[],
    enabled: !!storeId,
  });

  const handleEdit = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const columns = getStoreRefillShelfRequestColumns(handleEdit);

  if (!query.storeId) {
    return <LoadingPageComponent />;
  }

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý đặt kệ
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các đơn đặt kệ của cửa hàng
          </p>
        </div>
        <Button
          className="btn-primary-gradient"
          onClick={() => router.push("/manager/refill-shelf/create")}
        >
          <Plus /> Tạo đơn
        </Button>
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
