"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { QueryParams } from "@/src/types/SubType";
import { getAllShelfTypeAPI } from "@/src/services/shelf.service";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";
import ShelfGridView from "./components/ShelfView/ShelfGridView";
import CreateShelfTypeModal from "./components/CreateShelfTypeModal";

export default function AdminShelfTypeManage() {
  const [selectedShelfId, setSelectShelfId] = useState<string | null>(null);

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    searchName: "",
    categoryType: "",
    order: "",
  });

  const {
    data: shelfList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shelfs", query],
    queryFn: () => getAllShelfTypeAPI(query),
    select: (res) => res.data,
  });

  const handleViewDetail = (shelfTypeId: string) => {
    setSelectShelfId(shelfTypeId);
  };

  const { data: categoryList = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllProductCategoryAPI({ isActive: true }),
    select: (res) => res.data,
  });

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý loại kệ trưng bày
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách các loại kệ trong hệ thống
          </p>
        </div>
        <CreateShelfTypeModal />
      </div>

      {/*Table */}
      <ShelfGridView
        shelfList={shelfList ?? []}
        isLoading={isLoading}
        handleViewDetail={handleViewDetail}
        query={query}
        updateQuery={updateQuery}
        totalItems={shelfList.totalCount}
        totalPages={shelfList.totalPages}
      >
        <FilterSearch
          query={query}
          loading={isLoading}
          categoryList={categoryList}
          resultCount={shelfList.totalCount || shelfList.length}
          onSearch={(val) => updateQuery({ searchName: val })}
          onApplyFilter={(filter) =>
            updateQuery({
              ...filter,
              pageNumber: 1,
            })
          }
          onReset={() => resetQuery()}
          onRefresh={() => refetch()}
        />
      </ShelfGridView>

      <ViewDetailSheet
        shelfTypeId={selectedShelfId}
        isOpen={!!selectedShelfId}
        onClose={() => setSelectShelfId(null)}
      />
    </>
  );
}
