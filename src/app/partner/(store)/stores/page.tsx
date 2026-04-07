"use client";

import { Download, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { getAllStoreAPI } from "@/src/services/store.service";
import { Store } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreColumns } from "./columns";
import { useAuth } from "@/src/hooks/useAuth";
import { getAllCityAPI } from "@/src/services/city.service";

export default function PartnerStoreManage() {
  const { partner } = useAuth();
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    keyword: "",
    companyid: partner?.partnerId,
    cityId: "",
  });

  const {
    data: storeList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["stores", query],
    queryFn: () => getAllStoreAPI(query),
    select: (res) => res.data as Store[],
  });
  const columns = getStoreColumns();

  const { data: cityList = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => getAllCityAPI({}),
    select: (res) => res.data,
  });

  return (
    <>
      {/*Header */}
      <div>
        <h1 className="text-2xl font-bold dark:text-foreground">
          Quản lý cửa hàng
        </h1>
        <p className="text-gray-500 dark:text-gray-200">
          Danh sách tất cả các cửa hàng sở hữu trong hệ thống
        </p>
      </div>

      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={storeList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={storeList.length}
              cityList={cityList}
              onSearch={(val) => updateQuery({ keyword: val })}
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
