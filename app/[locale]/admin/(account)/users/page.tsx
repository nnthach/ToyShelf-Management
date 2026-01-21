"use client";

import { DataTable } from "../../../../../shared/styles/components/ui/data-table";
import { Button } from "../../../../../shared/styles/components/ui/button";
import { Upload } from "lucide-react";
import { QueryParams } from "@/shared/types/SubType";
import { getAllUserAPI } from "../../../../../shared/services/user.service";
import useQueryParams from "../../../../../shared/hooks/useQueryParams";
import { getUserColumns } from "./columns";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useMemo } from "react";
import useFetchList from "@/shared/hooks/useFetchList";
import { User } from "@/shared/types";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";

export default function AdminUserManage() {
  const t = useTranslations("admin.users");
  const tButton = useTranslations("admin.button");
  const tColumnTable = useTranslations("admin.tableColumn");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  // const debouncedSearch = useDebounce(query.search, 500);
  // const debouncedQuery = useMemo(
  //   () => ({ ...query, search: debouncedSearch }),
  //   [query, debouncedSearch],
  // );

  // const { data: userList = [], loading } = useFetchList<User[], QueryParams>(
  //   getAllUsers,
  //   debouncedQuery
  // );

  const { data: userList = [], isLoading } = useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUserAPI(query),
    select: (res) => res.data,
  });

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
          data={userList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={userList.length}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
            />

            <Button variant={"outline"}>
              <Upload /> {tButton("export")}
            </Button>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
