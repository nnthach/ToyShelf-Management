"use client";

import React, { useState } from "react";
import CreateProductColorModal from "./components/CreateProductColorModal";
import useQueryParams from "@/src/hooks/useQueryParams";
import { getProductColorColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import { QueryParams } from "@/src/types/SubType";
import {
  deleteProductColorDetailAPI,
  getAllProductColorAPI,
} from "@/src/services/product-color.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditProductColorModal from "./components/EditProductColorModal";
import { toast } from "react-toastify";

export default function AdminProductColor() {
  const [selectedColorId, setSelectedColorId] = useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const {
    data: productColorList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["colors", query],
    queryFn: () => getAllProductColorAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (colorId: string) => {
    setSelectedColorId(colorId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteProductColorDetailAPI,
    onSuccess: () => {
      toast.success("Xóa màu thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["colors"],
      });
    },
    onError: () => {
      toast.error("Xóa màu thất bại");
    },
  });

  const handleDelete = (colorId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa màu này không?");

    if (!confirmDelete) return;

    deleteMutation.mutate(colorId);
  };

  const columns = getProductColorColumns(handleEdit, handleDelete);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý màu sắc sản phẩm
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách màu sắc sản phẩm trong hệ thống
          </p>
        </div>
        <CreateProductColorModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={productColorList ?? []}
          isLoading={loading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={productColorList.length}
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

      {selectedColorId && (
        <EditProductColorModal
          colorId={selectedColorId}
          isOpen={!!selectedColorId}
          onClose={() => {
            setSelectedColorId("");
          }}
        />
      )}
    </div>
  );
}
