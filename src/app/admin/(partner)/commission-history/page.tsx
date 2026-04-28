"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { getCommissionHistoryColumns } from "./columns";
import { getAllCommissionHistoryAPI } from "@/src/services/commission-history.service";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { Partner, Store } from "@/src/types";
import { useEffect } from "react";
import { getAllStoreAPI } from "@/src/services/store.service";

export default function AdminCommissionHistory() {
  const { data: partnerList } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllPartnerAPI({}),
    select: (res) => res.data as Partner[],
  });

  const { data: storeList } = useQuery({
    queryKey: ["stores"],
    queryFn: () => getAllStoreAPI({}),
    select: (res) => res.data as Store[],
  });

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>(
    {
      partnerId: "",
      pageNumber: 1,
      pageSize: 10,
      keyword: "",
      storeId: "",
      fromDate: "",
      toDate: "",
    },
    {
      excludeResetKeys: ["partnerId"],
    },
  );

  const {
    data: commissionHistoryList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["commissionHistories", query],
    queryFn: () => getAllCommissionHistoryAPI(query),
    select: (res) => res.data,
    enabled: !!query.partnerId,
  });

  const columns = getCommissionHistoryColumns();

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý lịch sử hoa hồng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách lịch sử hoa hồng của đối tác
          </p>
        </div>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={commissionHistoryList.items ?? []}
          isLoading={loading}
          pageSize={query.pageSize}
          onPageChange={(page) => updateQuery({ pageNumber: page + 1 })}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              partnerList={partnerList || []}
              storeList={storeList || []}
              resultCount={commissionHistoryList.length}
              onSearch={(val) => updateQuery({ keyword: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                  pageNumber: 1,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />
          </div>
        </DataTable>
      </div>
    </div>
  );
}
