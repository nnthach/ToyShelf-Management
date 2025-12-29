"use client";

import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/shared/types/SubType";
import { getProductColumns } from "./columns";
import { useTranslations } from "next-intl";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { getAllProducts } from "@/shared/services/product.service";
import { useFilterSearchBar } from "@/shared/hooks/useFilterSearchBar";
import FilterSearchBar from "@/shared/components/FilterSearchBar";
import { DataTable } from "@/shared/styles/components/ui/data-table";
import { Button } from "@/shared/styles/components/ui/button";
import { useState } from "react";
import CreateProduct from "./components/CreateProduct";
import { useRouter } from "next/navigation";

export default function AdminProductManage() {
  const router = useRouter();
  const t = useTranslations("admin.products");
  const tButton = useTranslations("admin.button");
  const tColumnTable = useTranslations("admin.tableColumn");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    limit: 10,
    order: "",
    page: 1,
    search: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", query],
    queryFn: () => getAllProducts(query),
  });

  const {
    filters: tempFilter,
    setFilters: setTempFilter,
    handleChange: handleChangeFilter,
    resetFilter,
  } = useFilterSearchBar({
    order: "",
    status: "",
    limit: 10,
  });

  const handleLimitChange = (value: number) => {
    setTempFilter((prev) => ({ ...prev, limit: value }));
  };

  // Bấm Apply mới cập nhật
  const handleApplyFilters = () => {
    updateQuery({
      status: tempFilter.status,
      order: tempFilter.order,
      limit: tempFilter.limit,
      page: 1,
    });
  };

  const handleResetAllQueryParams = () => {
    resetFilter();
    resetQuery();
  };

  const columns = getProductColumns(tColumnTable);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold dark:text-foreground">
          {t("header")}
        </h1>
        <Button
          className="btn-primary-gradient"
          onClick={() => router.push("/admin/products/create")}
        >
          <Plus /> {tButton("createProduct")}
        </Button>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={data?.products ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearchBar
              tempFilter={tempFilter}
              onFilterChange={handleChangeFilter}
              onLimitChange={handleLimitChange}
              onApplyFilters={handleApplyFilters}
              query={{ search: query.search || "" }}
              updateQuery={updateQuery}
              reset={handleResetAllQueryParams}
            />
            <div className="space-x-3">
              <Button className="cursor-pointer">
                <ArrowDown /> {tButton("import")}
              </Button>
              <Button variant={"outline"} className="cursor-pointer">
                <ArrowUp /> {tButton("export")}
              </Button>
            </div>
          </div>
        </DataTable>
      </div>
    </>
  );
}
