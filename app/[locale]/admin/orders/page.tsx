"use client";

import { useDebounce } from "@/shared/hooks/useDebounce";
import useFetchList from "@/shared/hooks/useFetchList";
import useQueryParams from "@/shared/hooks/useQueryParams";
import { getAllOrders } from "@/shared/services/order.service";
import { DataTable } from "@/shared/styles/components/ui/data-table";
import { Order } from "@/shared/types";
import { QueryParams } from "@/shared/types/SubType";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/shared/styles/components/ui/button";
import { Upload } from "lucide-react";
import { getOrderColumns } from "./columns";

export default function AdminOrderManagement() {
  const t = useTranslations("admin.orders");
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

  const { data: orderList = [], loading } = useFetchList<Order[], QueryParams>(
    getAllOrders,
    debouncedQuery
  );

  const columns = getOrderColumns(tColumnTable);

  return (
    <div>
      {/*Header */}
      <div className="">
        <h1 className="text-4xl font-bold ">{t("header")}</h1>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={orderList ?? []} isLoading={loading}>
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={orderList.length}
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
