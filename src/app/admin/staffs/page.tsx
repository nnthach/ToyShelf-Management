"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStaffColumns } from "./columns";
import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import CreateStaffModal from "./components/CreateStaffModal";
import useFetchList from "@/src/hooks/useFetchList";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useMemo } from "react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { User } from "@/src/types";
import { getAllUserAPI } from "@/src/services/user.service";
import useQueryParams from "@/src/hooks/useQueryParams";

export default function AdminUserManage() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    order: "",
    search: "",
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const { data: staffList = [], loading } = useFetchList<User[], QueryParams>(
    getAllUserAPI,
    debouncedQuery,
  );
  const columns = getStaffColumns();

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý nhân viên</h1>
        <CreateStaffModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={staffList ?? []} isLoading={loading}>
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={staffList.length}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
            />

            <div className="space-x-3">
              <Button>
                <Download /> Nhập dữ liệu
              </Button>
              <Button variant={"outline"}>
                <Upload /> Xuất dữ liệu
              </Button>
            </div>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
