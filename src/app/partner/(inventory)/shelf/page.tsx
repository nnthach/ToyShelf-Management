"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getShelfColumns } from "./columns";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { Store } from "@/src/types";
import { useEffect } from "react";
import { getAllShelfAPI } from "@/src/services/shelf.service";
import FilterSearch from "./components/FilterSearch";
import { getAllStoreAPI } from "@/src/services/store.service";
import { useAuth } from "@/src/hooks/useAuth";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function AdminShelfManagement() {
  const { partner } = useAuth();

  const partnerId = partner?.partnerId;

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

  const { data: partnerStoreList, isLoading: isPartnerStoreLoading } = useQuery(
    {
      queryKey: ["partnerStores"],
      queryFn: () => getAllStoreAPI({ companyid: partnerId }),
      select: (res) => res.data as Store[],
      enabled: !!partnerId,
    },
  );

  useEffect(() => {
    if (partnerStoreList?.length && !query.inventoryLocationId) {
      updateQuery({
        inventoryLocationId: partnerStoreList[0].inventoryLocationId,
      });
    }
  }, [partnerStoreList]);

  const columns = getShelfColumns();

  if (isPartnerStoreLoading || !query.inventoryLocationId) {
    return <LoadingPageComponent />;
  }
  return (
    <>
      {/*Header */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold dark:text-foreground">
          Danh sách mã kệ trưng bày
        </h1>
        <p className="text-gray-500 dark:text-gray-200">
          Danh sách mã kệ trưng bày tại cửa hàng
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
              partnerStoreList={partnerStoreList}
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
