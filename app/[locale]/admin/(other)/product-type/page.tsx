"use client";

import useQueryParams from "@/shared/hooks/useQueryParams";
import { getAllProductCategoryAPI } from "@/shared/services/product-category.service";
import { useTranslations } from "next-intl";
import { QueryParams } from "next-intl/navigation";
import { useState } from "react";
import { getProductCategoryColumns } from "./columns";
import { DataTable } from "@/shared/styles/components/ui/data-table";
import { Button } from "@/shared/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import CreateCategoryModal from "./components/CreateCategoryModal";
import ViewDetailSheet from "./components/ViewDetailSheet";

export default function AdminProductType() {
  const t = useTranslations("admin.productCategory");
  const tButton = useTranslations("admin.button");
  const tColumnTable = useTranslations("admin.tableColumn");

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

  const columns = getProductCategoryColumns(tColumnTable, handleViewDetail);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">{t("header")}</h1>
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
              <Upload /> {tButton("export")}
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
