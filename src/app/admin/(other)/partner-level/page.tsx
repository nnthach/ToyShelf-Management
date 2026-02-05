"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useMemo } from "react";
import { getProductCategoryColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import useFetchList from "@/src/hooks/useFetchList";
import FilterSearch from "./components/FilterSearch";
import CreateProductCategoryModal from "./components/CreatePartnerLevelModal";
import { QueryParams } from "@/src/types/SubType";
import { ProductCategory } from "@/src/types";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";

export default function AdminPartnerLevel() {


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

  const { data: productCategoryList = [], loading } = useFetchList<
    ProductCategory[],
    QueryParams
  >(getAllProductCategoryAPI, debouncedQuery);

  const columns = getProductCategoryColumns();

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý danh mục sản phẩm</h1>
        <CreateProductCategoryModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={productCategoryList ?? []}
          isLoading={loading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={productCategoryList.length}
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
