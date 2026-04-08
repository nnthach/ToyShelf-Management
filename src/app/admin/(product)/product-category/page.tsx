"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { getProductCategoryColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import FilterSearch from "./components/FilterSearch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreateCategoryModal from "./components/CreateCategoryModal";
import { QueryParams } from "@/src/types/SubType";
import {
  deleteProductCategoryAPI,
  disableProductCategoryAPI,
  getAllProductCategoryAPI,
  restoreProductCategoryAPI,
} from "@/src/services/product-category.service";
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

  const {
    data: categoryList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["categories", query],
    queryFn: () => getAllProductCategoryAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  // delete
  const deleteMutation = useMutation({
    mutationFn: deleteProductCategoryAPI,
    onSuccess: () => {
      toast.success("Xóa danh mục thành công");

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error("Xóa danh mục thất bại");
    },
  });

  const handleDelete = (categoryId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa danh mục này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(categoryId);
  };

  // disable
  const disableMutation = useMutation({
    mutationFn: disableProductCategoryAPI,
    onSuccess: () => {
      toast.success("Vô hiệu hóa thành công");

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error("Vô hiệu hóa thất bại");
    },
  });

  const handleDisable = (categoryId: string) => {
    const confirmDisable = window.confirm(
      "Bạn có chắc muốn vô hiệu hóa danh mục này không?",
    );

    if (!confirmDisable) return;

    disableMutation.mutate(categoryId);
  };
  // restore
  const restoreMutation = useMutation({
    mutationFn: restoreProductCategoryAPI,
    onSuccess: () => {
      toast.success("Kích hoạt thành công");

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error("Kích hoạt thất bại");
    },
  });

  const handleRestore = (categoryId: string) => {
    restoreMutation.mutate(categoryId);
  };

  const columns = getProductCategoryColumns(handleEdit, handleDelete,handleDisable, handleRestore);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý danh mục sản phẩm
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách danh mục sản phẩm trong hệ thống
          </p>
        </div>{" "}
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
              onRefresh={() => refetch()}
            />
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
