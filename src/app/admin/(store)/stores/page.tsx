"use client";

import { Download, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { getAllStoreAPI } from "@/src/services/store.service";
import { Store } from "@/src/types";
import CreateStoreModal from "./components/CreateStoreModal";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreColumns } from "./columns";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { getAllCityAPI } from "@/src/services/city.service";

export default function AdminStoreManage() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    keyword: "",
    companyid: "",
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

  const { data: partnerList = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllPartnerAPI({}),
    select: (res) => res.data,
  });

  const { data: cityList = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => getAllCityAPI({}),
    select: (res) => res.data,
  });

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Quản lý cửa hàng</h1>
        <CreateStoreModal />
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
              partnerList={partnerList}
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

            <div className="space-x-3">
              <Button>
                <Download /> Nhập khẩu
              </Button>
              <Button variant={"outline"}>
                <Upload /> Xuất khẩu
              </Button>
            </div>
          </div>
        </DataTable>
      </div>
    </>
  );
}
