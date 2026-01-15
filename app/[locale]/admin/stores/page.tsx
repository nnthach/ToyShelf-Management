"use client";

import { LayoutGrid, List, Plus } from "lucide-react";
import { QueryParams } from "@/shared/types/SubType";
import { useTranslations } from "next-intl";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { Button } from "@/shared/styles/components/ui/button";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/shared/styles/lib/utils";
import StoreListView from "./components/StoreView/StoreListView";
import StoreGridView from "./components/StoreView/StoreGridView";
import { getAllStores } from "@/shared/services/store.service";
import { StoreFakeData } from "@/shared/constants/fakeData";
import { useDebounce } from "@/shared/hooks/useDebounce";
import useFetchList from "@/shared/hooks/useFetchList";
import { Store } from "@/shared/types";
import FilterSearch from "./components/FilterSearch";

export default function AdminStoreManage() {
  const router = useRouter();
  const t = useTranslations("admin.stores");
  const tButton = useTranslations("admin.button");

  const [productView, setProductView] = useState<"list" | "grid">("grid");

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

  const { data: storeList = [], loading } = useFetchList<Store[], QueryParams>(
    getAllStores,
    debouncedQuery
  );

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
            onClick={() => router.push("/admin/stores/create")}
          >
            <Plus /> {tButton("createStore")}
          </Button>
          <div className="flex items-center gap-1 rounded-lg border">
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
          </div>
        </div>
      </div>

      {/*Table */}
      {productView === "list" ? (
        <StoreListView storeList={StoreFakeData ?? []} isLoading={false}>
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={storeList.length}
            onSearch={(val) => updateQuery({ search: val })}
            onApplyFilter={(filter) =>
              updateQuery({
                ...filter,
              })
            }
            onReset={() => resetQuery()}
          />
        </StoreListView>
      ) : (
        <StoreGridView storeList={StoreFakeData ?? []} isLoading={false}>
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={storeList.length}
            onSearch={(val) => updateQuery({ search: val })}
            onApplyFilter={(filter) =>
              updateQuery({
                ...filter,
              })
            }
            onReset={() => resetQuery()}
          />
        </StoreGridView>
      )}
    </>
  );
}
