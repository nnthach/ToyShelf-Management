"use client";

import { LayoutGrid, List, Plus } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/src/styles/lib/utils";
import StoreListView from "./components/StoreView/StoreListView";
import StoreGridView from "./components/StoreView/StoreGridView";

import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QueryParams } from "@/src/types/SubType";
import { getAllStoreAPI } from "@/src/services/store.service";
import { Store } from "@/src/types";

export default function PartnerStoreManage() {
  const router = useRouter();

  const [productView, setProductView] = useState<"list" | "grid">("grid");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const { data: storeList = [], isLoading } = useQuery({
    queryKey: ["stores", query],
    queryFn: () => getAllStoreAPI(query),
    select: (res) => res.data as Store[],
  });

  console.log("store list", storeList);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý cửa hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Quản lý và cập nhật các cửa hàng của tổ chức
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="btn-primary-gradient"
            onClick={() => router.push("/partner/stores/create")}
          >
            <Plus /> Tạo cửa hàng
          </Button>
          <div className="flex items-center gap-1 rounded-lg border">
            {/* Grid view */}
            <Button
              type="button"
              title="Chế độ lưới"
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
            {/* List view */}
            <Button
              type="button"
              title="Chế độ danh sách"
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
          </div>
        </div>
      </div>

      {/*Table */}
      {productView === "list" ? (
        <StoreListView storeList={storeList ?? []} isLoading={isLoading}>
          <FilterSearch
            query={query}
            loading={isLoading}
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
        <StoreGridView storeList={storeList ?? []} isLoading={isLoading}>
          <FilterSearch
            query={query}
            loading={isLoading}
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
