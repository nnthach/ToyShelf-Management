"use client";

import React, { useMemo } from "react";
import CreateProductColorModal from "./components/CreateProductColorModal";

import { useDebounce } from "@/src/hooks/useDebounce";
import useQueryParams from "@/src/hooks/useQueryParams";
import useFetchList from "@/src/hooks/useFetchList";
import { getProductColorColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import { QueryParams } from "@/src/types/SubType";
import { ProductColor } from "@/src/types";
import { getAllProductColor } from "@/src/services/product-color.service copy";

export default function AdminProductColor() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    order: "",
    search: "",
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const { data: productColorList = [], loading } = useFetchList<
    ProductColor[],
    QueryParams
  >(getAllProductColor, debouncedQuery);

  const columns = getProductColorColumns();

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý màu sắc sản phẩm</h1>
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
            />

            <Button variant={"outline"}>
              <Upload /> Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
