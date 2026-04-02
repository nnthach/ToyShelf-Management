"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getInventoryColumns } from "./columns";
import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import CreateInventoryModal from "./components/CreateInventoryModal";
import { getAllInventoryAPI } from "@/src/services/inventory.service";

export default function AdminInventoryManage() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const {
    data: inventoryList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["inventories", query],
    queryFn: () => getAllInventoryAPI(query),
    select: (res) => res.data,
  });

  const columns = getInventoryColumns();

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý nhập hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các đơn hàng nhập trong hệ thống
          </p>
        </div>
        <CreateInventoryModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={inventoryList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={inventoryList.length}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
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
