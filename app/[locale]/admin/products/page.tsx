"use client";

import {
  ArrowDown,
  ArrowUp,
  Download,
  LayoutGrid,
  List,
  Plus,
  Upload,
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/shared/styles/lib/utils";
import ProductListView from "./components/ProductView/ProductListView";
import ProductGridView from "./components/ProductView/ProductGridView";

export default function AdminProductManage() {
  const router = useRouter();
  const t = useTranslations("admin.products");
  const tButton = useTranslations("admin.button");

  const [productView, setProductView] = useState<"list" | "grid">("list");

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

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            {t("header")}
          </h1>
          <p className="text-gray-500 dark:text-gray-200">{t("subheader")}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="btn-primary-gradient"
            onClick={() => router.push("/admin/products/create")}
          >
            <Plus /> {tButton("createProduct")}
          </Button>
          <div className="flex items-center gap-1 rounded-lg border">
            {/* List view */}
            <Button
              type="button"
              title={t("listView")}
              onClick={() => setProductView("list")}
              variant="ghost"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-sm transition-all hover:text-blue-400 dark:hover:text-white",
                productView === "list"
                  ? "bg-white dark:bg-sidebar text-blue-600 shadow dark:bg-white dark:text-black"
                  : "text-neutral-400 bg-gray-100 dark:bg-neutral-700"
              )}
            >
              <List />
            </Button>

            {/* Grid view */}
            <Button
              type="button"
              title={t("gridView")}
              onClick={() => setProductView("grid")}
              variant="ghost"
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all hover:text-blue-400 dark:hover:text-white",
                productView === "grid"
                  ? "bg-white dark:bg-sidebar text-blue-600 shadow dark:bg-white dark:text-black"
                  : "text-neutral-400 bg-gray-100 dark:bg-neutral-700"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/*Table */}
      {productView === "list" ? (
        <ProductListView
          productList={data?.products ?? []}
          isLoading={isLoading}
          tempFilter={tempFilter}
          handleChangeFilter={handleChangeFilter}
          handleLimitChange={handleLimitChange}
          handleApplyFilters={handleApplyFilters}
          query={query}
          updateQuery={updateQuery}
          handleResetAllQueryParams={handleResetAllQueryParams}
        />
      ) : (
        <ProductGridView
          productList={data?.products ?? []}
          isLoading={isLoading}
          tempFilter={tempFilter}
          handleChangeFilter={handleChangeFilter}
          handleLimitChange={handleLimitChange}
          handleApplyFilters={handleApplyFilters}
          query={query}
          updateQuery={updateQuery}
          handleResetAllQueryParams={handleResetAllQueryParams}
        />
      )}
    </>
  );
}
