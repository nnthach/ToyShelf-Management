"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { getProductCategoryColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreateCategoryModal from "./components/CreateCategoryModal";
import { QueryParams } from "@/src/types/SubType";
import { deleteProductCategoryAPI, getAllProductCategoryAPI } from "@/src/services/product-category.service";
import EditCategoryModal from "./components/EditCategoryModal";
import { toast } from "react-toastify";

export default function AdminProductType() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const { data: categoryList = [], isLoading } = useQuery({
    queryKey: ["categories", query],
    queryFn: () => getAllProductCategoryAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteProductCategoryAPI,
    onSuccess: () => {
      toast.success("Xóa danh mục thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error("Xóa danh mục thất bại");
    },
  });

  const handleDelete = (categoryId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa danh mục này không?");

    if (!confirmDelete) return;

    deleteMutation.mutate(categoryId);
  };

  const columns = getProductCategoryColumns(handleEdit, handleDelete);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý danh mục sản phẩm</h1>
        <CreateCategoryModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={categoryList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={categoryList.length}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
            />

            <Button variant={"outline"}>
              <Upload /> Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>

      {selectedCategoryId && (
        <EditCategoryModal
          categoryId={selectedCategoryId}
          isOpen={!!selectedCategoryId}
          onClose={() => {
            setSelectedCategoryId(null);
          }}
        />
      )}
    </>
  );
}
