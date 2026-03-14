"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { getInventoryDispositionColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { deleteProductCategoryAPI } from "@/src/services/product-category.service";
import { toast } from "react-toastify";
import {
  deleteInventoryDispositionAPI,
  getAllInventoryDispositionAPI,
} from "@/src/services/inventory-disposition.service";
import CreateInventoryDispositionModal from "./components/CreateInventoryDispositionModal";
import EditInventoryDispositionModal from "./components/EditInventoryDispositionModal";

export default function AdminProductType() {
  const [selectedInventoryDispositionId, setSelectedInventoryDispositionId] =
    useState<string | null>(null);

  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const {
    data: inventoryDispositionList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["inventoryDispositions", query],
    queryFn: () => getAllInventoryDispositionAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (inventoryDispositionId: string) => {
    setSelectedInventoryDispositionId(inventoryDispositionId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryDispositionAPI,
    onSuccess: () => {
      toast.success("Xóa trạng thái thành công");

      queryClient.invalidateQueries({
        queryKey: ["inventoryDispositions"],
      });
    },
    onError: () => {
      toast.error("Xóa trạng thái thất bại");
    },
  });

  const handleDelete = (inventoryDispositionId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa trạng thái này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(inventoryDispositionId);
  };

  const columns = getInventoryDispositionColumns(handleEdit, handleDelete);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý trạng thái hàng tồn kho</h1>
        <CreateInventoryDispositionModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={inventoryDispositionList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={inventoryDispositionList.length}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />

            <Button variant={"outline"}>
              <Upload /> Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>

      {selectedInventoryDispositionId && (
        <EditInventoryDispositionModal
          inventoryDispositionId={selectedInventoryDispositionId}
          isOpen={!!selectedInventoryDispositionId}
          onClose={() => {
            setSelectedInventoryDispositionId(null);
          }}
        />
      )}
    </>
  );
}
