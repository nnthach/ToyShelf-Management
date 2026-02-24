"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useMemo, useState } from "react";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import useFetchList from "@/src/hooks/useFetchList";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { ProductPriceSegment } from "@/src/types";
import {
  deleteProducePriceSegmentAPI,
  getAllProducePriceSegmentAPI,
} from "@/src/services/product-segment.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getProductPriceSegmentColumns } from "./columns";
import CreateProductPriceSegmentModal from "./components/CreateProductPriceSegmentModal";
import EditProductPriceSegmentModal from "./components/EditProductPriceSegmentModal";

export default function AdminProductPriceLevel() {
  const [selectedPriceSegmentId, setSelectedPriceSegmentId] = useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const { data: productPriceSegmentList = [], isLoading: loading } = useQuery({
    queryKey: ["productPriceSegments", query],
    queryFn: () => getAllProducePriceSegmentAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (colorId: string) => {
    setSelectedPriceSegmentId(colorId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteProducePriceSegmentAPI,
    onSuccess: () => {
      toast.success("Xóa thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["productPriceSegments"],
      });
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const handleDelete = (colorId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa màu này không?");

    if (!confirmDelete) return;

    deleteMutation.mutate(colorId);
  };

  const columns = getProductPriceSegmentColumns(handleEdit, handleDelete);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý cấp độ giá sản phẩm</h1>
        <CreateProductPriceSegmentModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={productPriceSegmentList ?? []}
          isLoading={loading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={productPriceSegmentList.length}
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

      {selectedPriceSegmentId && (
        <EditProductPriceSegmentModal
          priceSegmentId={selectedPriceSegmentId}
          isOpen={!!selectedPriceSegmentId}
          onClose={() => {
            setSelectedPriceSegmentId("");
          }}
        />
      )}
    </div>
  );
}
