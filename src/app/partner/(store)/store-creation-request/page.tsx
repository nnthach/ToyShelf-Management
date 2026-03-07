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
import CreateStoreRequestModal from "./components/CreateStoreCreationRequestModal";
import {
  deleteStoreCreationRequestAPI,
  getAllStoreCreationRequestAPI,
} from "@/src/services/store-create-request.service";
import { toast } from "react-toastify";
import { useState } from "react";

export default function PartnerStoreCreationRequestManage() {
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const { data: storeCreateRequestList = [], isLoading } = useQuery({
    queryKey: ["storeRequests", query],
    queryFn: () => getAllStoreCreationRequestAPI(query),
    select: (res) => res.data as Store[],
  });

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

  const columns = getStoreCreateRequestColumns(handleDelete);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Yêu cầu tạo cửa hàng</h1>
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
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
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


    </>
  );
}
