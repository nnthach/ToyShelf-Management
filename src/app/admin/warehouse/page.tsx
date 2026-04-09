"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { useState } from "react";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { getWarehouseColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import ViewDetailSheet from "./components/ViewDetailSheet";
import CreateWarehouseModal from "./components/CreateWarehouseModal";
import { QueryParams } from "@/src/types/SubType";
import { getAllWarehouseAPI } from "@/src/services/warehouse.service";

export default function AdminWarehouseManagement() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const {
    data: warehouseList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["warehouses", query],
    queryFn: () => getAllWarehouseAPI(query),
    select: (res) => res.data,
  });

  const columns = getWarehouseColumns();

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý kho hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách kho hàng trong hệ thống
          </p>
        </div>
        <CreateWarehouseModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={warehouseList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={warehouseList.length}
              onSearch={(val) => updateQuery({ search: val || undefined })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />
          </div>
        </DataTable>
      </div>

      <ViewDetailSheet
        warehouseId={selectedWarehouseId}
        isOpen={!!selectedWarehouseId}
        onClose={() => setSelectedWarehouseId(null)}
      />
    </>
  );
}
