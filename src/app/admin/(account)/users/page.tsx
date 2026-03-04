"use client";

import { DataTable } from "../../../../styles/components/ui/data-table";
import { Button } from "../../../../styles/components/ui/button";
import { Upload } from "lucide-react";
import useQueryParams from "../../../../hooks/useQueryParams";
import { getUserColumns } from "./columns";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { getAllUserAPI } from "@/src/services/user.service";

export default function AdminUserManage() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const { data: userList = [], isLoading } = useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUserAPI(query),
    select: (res) => res.data,
  });

  const columns = getUserColumns();

  return (
    <div>
      {/*Header */}
      <div>
        <h1 className="text-4xl font-bold">Quản lý người dùng</h1>
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
              <Upload /> Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
