"use client";

import useQueryParams from "@/shared/hooks/useQueryParams";
import { getAllProductCategory } from "@/shared/services/product-category.service";
import { useTranslations } from "next-intl";
import { QueryParams } from "next-intl/navigation";
import { useMemo } from "react";
import { getProductCategoryColumns } from "./columns";
import { DataTable } from "@/shared/styles/components/ui/data-table";
import { Button } from "@/shared/styles/components/ui/button";
import { Upload } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ProductCategory } from "@/shared/types";
import useFetchList from "@/shared/hooks/useFetchList";
import FilterSearch from "./components/FilterSearch";
import CreateProductCategoryModal from "./components/CreateProductPriceLevelModal";

export default function AdminProductPriceLevel() {
  const t = useTranslations("admin.productPriceLevel");
  const tButton = useTranslations("admin.button");
  const tColumnTable = useTranslations("admin.tableColumn");

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
  >(getAllProductCategory, debouncedQuery);

  const columns = getProductCategoryColumns(tColumnTable);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">{t("header")}</h1>
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
              <Upload /> {tButton("export")}
            </Button>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
