"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { getProductCategoryColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import CreateCategoryModal from "./components/CreateCategoryModal";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { QueryParams } from "@/src/types/SubType";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";

export default function AdminProductType() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: undefined,
    search: undefined,
  });

  const { data: categoryList = [], isLoading } = useQuery({
    queryKey: ["categories", query],
    queryFn: () => getAllProductCategoryAPI(query),
    select: (res) => res.data,
  });

  const handleViewDetail = (warehouseId: string) => {
    setSelectedCategoryId(warehouseId);
  };

  const columns = getProductCategoryColumns(handleViewDetail);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý cấp độ giá sản phẩm</h1>
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

      <ViewDetailSheet
        productCateId={selectedCategoryId}
        isOpen={!!selectedCategoryId}
        onClose={() => setSelectedCategoryId(null)}
      />
    </>
  );
}
