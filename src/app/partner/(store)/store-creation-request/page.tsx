"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import FilterSearch from "./components/FilterSearch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { Store } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreCreateRequestColumns } from "./columns";
import CreateStoreRequestModal from "./components/CreateStoreCreationRequestModal";
import {
  deleteStoreCreationRequestAPI,
  getAllStoreCreationRequestAPI,
} from "@/src/services/store-create-request.service";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ViewStoreCreateRequestModal from "./components/ViewStoreCreationRequestModal";
import { useAuth } from "@/src/hooks/useAuth";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function PartnerStoreCreationRequestManage() {
  const queryClient = useQueryClient();
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { partner } = useAuth();
  const partnerId = partner?.partnerId || "";

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>(
    {
      status: "",
      partnerId: "",
    },
    {
      excludeResetKeys: ["partnerId"],
    },
  );

  const {
    data: storeCreateRequestList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["storeRequests", query],
    queryFn: () => getAllStoreCreationRequestAPI(query),
    select: (res) => res.data as Store[],
  });

  useEffect(() => {
    if (partnerId && !query.partnerId) {
      updateQuery({
        partnerId: partnerId,
      });
    }
  }, [partnerId]);

  const handleViewDetail = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteStoreCreationRequestAPI,
    onSuccess: () => {
      toast.success("Xóa thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["storeRequests"],
      });
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const handleDelete = (cityId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa yêu cầu này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(cityId);
  };

  const columns = getStoreCreateRequestColumns(handleDelete, handleViewDetail);

  if (!partnerId) {
    return <LoadingPageComponent />;
  }
  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý yêu cầu tạo cửa hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các yêu cầu tạo cửa hàng
          </p>
        </div>
        <CreateStoreRequestModal />
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
        <ViewStoreCreateRequestModal
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
