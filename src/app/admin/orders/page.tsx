"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import { getOrderColumns } from "./columns";
import { QueryParams } from "@/src/types/SubType";
import { getAllOrdersAPI } from "@/src/services/order.service";
import { useQuery } from "@tanstack/react-query";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { Partner, Store } from "@/src/types";
import { getAllStoreAPI } from "@/src/services/store.service";
import { useState } from "react";

export default function AdminOrderManagement() {
  const [tempPartnerId, setTempPartnerId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    storeId: "",
    partnerId: "",
    phone: "",
  });

  const {
    data: orderList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", query],
    queryFn: () => getAllOrdersAPI(query),
    select: (res) => res.data,
  });

  const { data: partnerList = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllPartnerAPI({}),
    select: (res) => res.data as Partner[],
  });

  const { data: storeList = [] } = useQuery({
    queryKey: ["stores", tempPartnerId],
    queryFn: () =>
      getAllStoreAPI(tempPartnerId ? { companyid: tempPartnerId } : {}),
    select: (res) => res.data as Store[],
  });

  const columns = getOrderColumns();

  return (
    <>
      {/*Header */}
      <div className="">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Danh sách đơn hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Bộ lọc thông minh theo đối tác và cửa hàng trong hệ thống
          </p>
        </div>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={orderList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <FilterSearch
              query={query}
              loading={isLoading}
              partnerList={partnerList}
              storeList={storeList}
              resultCount={orderList.length}
              onSearch={(val) => updateQuery({ phone: val })}
              onPartnerChange={setTempPartnerId}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />

            <Button variant={"outline"}>
              <Upload />
              Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>
    </>
  );
}
