"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getShelfColumns } from "./columns";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { InventoryLocation } from "@/src/types";
import { useEffect, useState } from "react";
import {
  getAllShelfAPI,
  getAllShelfTypeAPI,
  getTotalShelfCountAPI,
} from "@/src/services/shelf.service";
import { getAllInventoryLocationAPI } from "@/src/services/inventory-location.service";
import FilterSearch from "./components/FilterSearch";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import {
  ArchiveRestore,
  CheckCircle2,
  ClipboardPen,
  Server,
} from "lucide-react";

export default function AdminShelfManagement() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>(
    {
      pageNumber: 1,
      pageSize: 10,
      status: "",
      shelfTypeId: "",
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

  const { data: shelfTypeList = [] } = useQuery({
    queryKey: ["shelfTypes", query],
    queryFn: () => getAllShelfTypeAPI(query),
    select: (res) => res.data,
  });

  const { data: totalShelfCount = [] } = useQuery({
    queryKey: ["shelfCounts"],
    queryFn: () => getTotalShelfCountAPI({}),
    select: (res) => res.data,
  });

  const { data: totalShelfCountAvailable = [] } = useQuery({
    queryKey: ["shelfCountAvailable"],
    queryFn: () => getTotalShelfCountAPI({ status: "Available" }),
    select: (res) => res.data,
  });

  const { data: totalShelfCountInUse = [] } = useQuery({
    queryKey: ["shelfCountInUse"],
    queryFn: () => getTotalShelfCountAPI({ status: "InUse" }),
    select: (res) => res.data,
  });

  const { data: totalShelfCountMaintenance = [] } = useQuery({
    queryKey: ["shelfCountMaintenance"],
    queryFn: () => getTotalShelfCountAPI({ status: "Maintenance" }),
    select: (res) => res.data,
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
        <StatCardWithButton
          title="Tổng kệ trong kệ thống"
          value={totalShelfCount?.totalShelf || 0}
          icon={Server}
          color="bg-blue-100 text-blue-900"
          subTitle="Trong toàn hệ thống"
        />

        <StatCardWithButton
          title="Tổng kệ sẵn có"
          value={totalShelfCountAvailable?.totalShelf || 0}
          icon={CheckCircle2}
          color="bg-green-100 text-green-900"
          subTitle="Trong toàn hệ thống"
        />
        <StatCardWithButton
          title="Tổng kệ đang sử dụng"
          value={totalShelfCountInUse?.totalShelf || 0}
          icon={ClipboardPen}
          color="bg-purple-100 text-purple-900"
          subTitle="Trong toàn hệ thống"
        />

        <StatCardWithButton
          title="Tổng kệ bảo trì"
          value={totalShelfCountMaintenance?.totalShelf || 0}
          icon={ArchiveRestore}
          color="bg-orange-100 text-orange-900"
          subTitle="Trong toàn hệ thống"
        />
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
              shelfTypeList={shelfTypeList}
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
