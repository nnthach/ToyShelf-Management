"use client";

import { DataTable } from "../../../../../shared/styles/components/ui/data-table";
import { getStaffColumns } from "./columns";
import { Button } from "../../../../../shared/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { QueryParams } from "@/shared/types/SubType";
import useQueryParams from "../../../../../shared/hooks/useQueryParams";
import { useTranslations } from "next-intl";
import CreateStaffModal from "./components/CreateStaffModal";
import useFetchList from "@/shared/hooks/useFetchList";
import { User } from "@/shared/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useMemo } from "react";
import FilterSearch from "./components/FilterSearch";
import { getAllUserAPI } from "@/shared/services/user.service";

export default function AdminUserManage() {
  const t = useTranslations("admin.staffs");
  const tButton = useTranslations("admin.button");
  const tColumnTable = useTranslations("admin.tableColumn");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    order: "",
    search: "",
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch]
  );

  const { data: staffList = [], loading } = useFetchList<User[], QueryParams>(
    getAllUserAPI,
    debouncedQuery
  );
  const columns = getStaffColumns(tColumnTable);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">{t("header")}</h1>
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
                <Download /> {tButton("import")}
              </Button>
              <Button variant={"outline"}>
                <Upload /> {tButton("export")}
              </Button>
            </div>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
