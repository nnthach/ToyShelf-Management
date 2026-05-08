"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getShelfColumns } from "./columns";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { InventoryLocation } from "@/src/types";
import { useEffect, useState } from "react";
import { getAllShelfAPI } from "@/src/services/shelf.service";
import { getAllInventoryLocationAPI } from "@/src/services/inventory-location.service";
import FilterSearch from "./components/FilterSearch";

export default function AdminShelfManagement() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>(
    {
      pageNumber: 1,
      pageSize: 10,
      status: "",
      inventoryLocationId: "",
    },
    {
      excludeResetKeys: ["inventoryLocationId"],
    },
  );

  const {
    data: shelfList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shelves", query],
    queryFn: () => getAllShelfAPI(query),
    select: (res) => res.data,
    enabled: !!query.inventoryLocationId,
  });

  const { data: locationList } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllInventoryLocationAPI({}),
    select: (res) => res.data as InventoryLocation[],
  });

  useEffect(() => {
    if (!locationList?.length) return;

    const isValid = locationList.some(
      (l) => l.id === query.inventoryLocationId,
    );

    if (!isValid) {
      updateQuery({
        inventoryLocationId: locationList[0].id,
      });
    }
  }, [locationList, query.inventoryLocationId]);

  const columns = getShelfColumns();

  return (
    <>
      {/*Header */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold dark:text-foreground">
          Danh sách kệ trưng bày
        </h1>
        <p className="text-gray-500 dark:text-gray-200">
          Danh sách kệ trưng bày tại cửa hàng và kho
        </p>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={shelfList?.items ?? []}
          isLoading={isLoading}
          pageSize={shelfList?.pageSize}
          pageNumber={shelfList?.pageNumber}
          totalCount={shelfList?.totalCount}
          totalPages={shelfList?.totalPages}
          onPageChange={(page) =>
            updateQuery({
              pageNumber: page,
            })
          }
        >
          <div className="p-4 border-b flex justify-between items-center">
            <FilterSearch
              query={query}
              loading={isLoading}
              locationList={locationList}
              resultCount={shelfList?.items?.length}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />
          </div>
        </DataTable>
      </div>
    </>
  );
}
