"use client";

import { DataTable } from "../../../../../shared/styles/components/ui/data-table";
import { Button } from "../../../../../shared/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { QueryParams } from "@/shared/types/SubType";
import { getAllUsers } from "../../../../../shared/services/user.service";
import useQueryParams from "../../../../../shared/hooks/useQueryParams";
import { getPartnerColumns } from "./columns";
import { useTranslations } from "next-intl";
import CreatePartnerModal from "./components/CreatePartnerModal";
import { User } from "@/shared/types";
import useFetchList from "@/shared/hooks/useFetchList";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useMemo } from "react";
import FilterSearch from "./components/FilterSearch";

export default function AdminUserManage() {
  const t = useTranslations("admin.partners");
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

  const { data: partnerList = [], loading } = useFetchList<User[], QueryParams>(
    getAllUsers,
    debouncedQuery
  );

  const columns = getPartnerColumns(tColumnTable);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{t("header")}</h1>
        <CreatePartnerModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={partnerList ?? []}
          isLoading={loading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={partnerList.length}
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
