"use client";

import React, { useMemo } from "react";
import CreateProductColorModal from "./components/CreateProductColorModal";
import { ProductColor } from "@/shared/types";
import { QueryParams } from "@/shared/types/SubType";
import { getAllProductColor } from "@/shared/services/product-color.service copy";
import { useDebounce } from "@/shared/hooks/useDebounce";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { useTranslations } from "next-intl";
import useFetchList from "@/shared/hooks/useFetchList";
import { getProductColorColumns } from "./columns";
import { DataTable } from "@/shared/styles/components/ui/data-table";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/shared/styles/components/ui/button";
import { Upload } from "lucide-react";

export default function AdminProductColor() {
  const t = useTranslations("admin.productColor");
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
    [query, debouncedSearch]
  );

  const { data: productColorList = [], loading } = useFetchList<
    ProductColor[],
    QueryParams
  >(getAllProductColor, debouncedQuery);

  const columns = getProductColorColumns(tColumnTable);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">{t("header")}</h1>
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
              <Upload /> {tButton("export")}
            </Button>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
