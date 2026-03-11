"use client";

import { useDebounce } from "@/src/hooks/useDebounce";
import useFetchList from "@/src/hooks/useFetchList";
import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { useMemo } from "react";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import { getOrderColumns } from "./columns";
import { QueryParams } from "@/src/types/SubType";
import { Order } from "@/src/types";
import { getAllOrders } from "@/src/services/order.service";

export default function AdminOrderManagement() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    order: "",
    search: "",
  });

  const { data: orderList = [], loading } = useFetchList<Order[], QueryParams>(
    getAllOrders,
    query,
  );

  const columns = getOrderColumns();

  return (
    <div>
      {/*Header */}
      <div className="">
        <h1 className="text-4xl font-bold ">Quản lý đơn hàng</h1>
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
              <Upload />
              Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>
    </div>
  );
}
