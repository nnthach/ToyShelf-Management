"use client";

import { LayoutGrid, List, Plus } from "lucide-react";
import { QueryParams } from "@/shared/types/SubType";
import { useTranslations } from "next-intl";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { Button } from "@/shared/styles/components/ui/button";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/shared/styles/lib/utils";
import ProductListView from "./components/ProductView/ProductListView";
import ProductGridView from "./components/ProductView/ProductGridView";
import { Product } from "@/shared/types";
import useFetchList from "@/shared/hooks/useFetchList";
import { useDebounce } from "@/shared/hooks/useDebounce";
import FilterSearch from "./components/FilterSearch";
import { getAllProductAPI } from "@/shared/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { getProductColumns } from "./columns";
import ViewDetailSheet from "./components/ViewDetailSheet";

export default function AdminProductManage() {
  const router = useRouter();
  const t = useTranslations("admin.products");
  const tButton = useTranslations("admin.button");
  const tColumnTable = useTranslations("admin.tableColumn");

  const [productView, setProductView] = useState<"list" | "grid">("list");

  const [selectedProductId, setSelectProductId] = useState<string | null>(null);

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: undefined,
    search: undefined,
  });

  const { data: productList = [], isLoading } = useQuery({
    queryKey: ["products", query],
    queryFn: () => getAllProductAPI(query),
    select: (res) => res.data,
  });

  const handleViewDetail = (productId: string) => {
    setSelectProductId(productId);
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
                  : "text-neutral-400 bg-gray-100 dark:bg-neutral-700",
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
                  : "text-neutral-400 bg-gray-100 dark:bg-neutral-700",
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
          handleViewDetail={handleViewDetail}
          productList={productList ?? []}
          isLoading={isLoading}
        >
          <FilterSearch
            query={query}
            loading={isLoading}
            resultCount={productList.length}
            onSearch={(val) => updateQuery({ search: val })}
            onApplyFilter={(filter) =>
              updateQuery({
                ...filter,
              })
            }
            onReset={() => resetQuery()}
          />
        </ProductListView>
      ) : (
        <ProductGridView
          productList={productList ?? []}
          isLoading={isLoading}
          handleViewDetail={handleViewDetail}
        >
          <FilterSearch
            query={query}
            loading={isLoading}
            resultCount={productList.length}
            onSearch={(val) => updateQuery({ search: val })}
            onApplyFilter={(filter) =>
              updateQuery({
                ...filter,
              })
            }
            onReset={() => resetQuery()}
          />
        </ProductGridView>
      )}

      <ViewDetailSheet
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectProductId(null)}
      />
    </>
  );
}
