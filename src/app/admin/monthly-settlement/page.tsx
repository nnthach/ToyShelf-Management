"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getMonthlySettlementColumns } from "./columns";
import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { getAllMonthlySettlementAPI } from "@/src/services/monthly-settlement.service";

export default function AdminMonthlySettlementManage() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    year: 0,
    month: 0,
    partnerId: "",
  });

  const {
    data: monthlySettlementList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["monthlySettlements", query],
    queryFn: () => getAllMonthlySettlementAPI(query),
    select: (res) => res.data,
  });

  const columns = getMonthlySettlementColumns();

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Danh sách đối soát hoa hồng hàng tháng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách đối soát hoa hồng hàng tháng cho đối tác trong hệ thống
          </p>
        </div>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={monthlySettlementList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={monthlySettlementList.length}
              onApplyFilter={(filter) =>
                updateQuery({
                  status: filter.status,
                  year: filter.year,
                  month: filter.month,
                  partnerId: filter.partnerId,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />

            <div className="space-x-3">
              <Button>
                <Upload /> Xuất dữ liệu
              </Button>
            </div>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
