"use client";

import { DataTable } from "../../../../../shared/styles/components/ui/data-table";
import { Button } from "../../../../../shared/styles/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/shared/types/SubType";
import { getAllUsers } from "../../../../../shared/services/user.service";
import useQueryParams from "../../../../../shared/hooks/useQueryParams";
import FilterSearchBar from "../../../../../shared/components/FilterSearchBar";
import { useFilterSearchBar } from "../../../../../shared/hooks/useFilterSearchBar";
import { getUserColumns } from "./columns";
import { useTranslations } from "next-intl";

export default function AdminUserManage() {
  const t = useTranslations("admin.users");
  const tButton = useTranslations("admin.button");
  const tColumnTable = useTranslations("admin.tableColumn");
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    limit: 10,
    order: "",
    page: 1,
    search: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUsers(query),
  });

  const {
    filters: tempFilter,
    setFilters: setTempFilter,
    handleChange: handleChangeFilter,
    resetFilter,
  } = useFilterSearchBar({
    order: "",
    status: "",
    limit: 10,
  });

  const handleLimitChange = (value: number) => {
    setTempFilter((prev) => ({ ...prev, limit: value }));
  };

  // Bấm Apply mới cập nhật
  const handleApplyFilters = () => {
    updateQuery({
      status: tempFilter.status,
      order: tempFilter.order,
      limit: tempFilter.limit,
      page: 1,
    });
  };

  const handleResetAllQueryParams = () => {
    resetFilter();
    resetQuery();
  };

  const columns = getUserColumns(tColumnTable);

  return (
    <div>
      {/*Header */}
      <div>
        <h1 className="text-4xl font-bold">{t("header")}</h1>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={data?.users ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearchBar
              tempFilter={tempFilter}
              onFilterChange={handleChangeFilter}
              onLimitChange={handleLimitChange}
              onApplyFilters={handleApplyFilters}
              query={{ search: query.search || "" }}
              updateQuery={updateQuery}
              reset={handleResetAllQueryParams}
            />

            <Button className="cursor-pointer">
              <ArrowUp /> {tButton("export")}
            </Button>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
