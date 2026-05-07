"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getMonthlySettlementColumns } from "./columns";
import { Button } from "@/src/styles/components/ui/button";
import { Mail, Percent, TrendingUp, Upload, User } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { getAllMonthlySettlementAPI } from "@/src/services/monthly-settlement.service";
import { useState } from "react";
import ExportMonthlySettlement from "./components/ExportMonthlySettlement";
import TopPartner from "./components/TopPartner";
import TotalRevenue from "./components/TotalRevenue";
import TopStore from "./components/TopStore";
import TopSelling from "./components/TopSelling";

export default function AdminTotalMonthlyManage() {
  const [isOpenExportModal, setIsOpenExportModal] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: undefined,
    year: currentYear,
    month: currentMonth,
    partnerId: undefined,
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
            Tổng kết tháng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Tổng kết hoạt động kinh doanh hàng tháng
          </p>
        </div>
      </div>
      {/*Total Revenue */}
      <TotalRevenue />

      {/*Top partner*/}
      <TopPartner />

      {/*Top store */}
      <TopStore />

      {/*Top selling */}
      <TopSelling />

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
                  partnerId: filter.partnerId,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />

            <div className="space-x-3">
              <Button
                variant={"outline"}
                onClick={() => setIsOpenExportModal(true)}
              >
                <Upload /> Xuất dữ liệu
              </Button>
            </div>
          </div>
        </DataTable>
      </div>

      <ExportMonthlySettlement
        isOpen={isOpenExportModal}
        onClose={() => setIsOpenExportModal(false)}
      />
    </div>
  );
}
