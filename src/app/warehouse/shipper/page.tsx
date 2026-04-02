"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getShipperColumns } from "./columns";
import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { getAllWarehouseStaffAPI } from "@/src/services/user.service";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/useAuth";

export default function WarehouseShipperManage() {
  const { warehouse } = useAuth();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const {
    data: shipperList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["warehouseStaffs", { warehouseId: warehouse?.warehouseId }],
    queryFn: () =>
      getAllWarehouseStaffAPI({
        warehouseId: warehouse?.warehouseId,
        role: "Shipper",
      }),
    select: (res) => res.data,
    enabled: !!warehouse?.warehouseId,
  });

  const columns = getShipperColumns();

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-foreground">
          Quản lý nhân viên giao hàng
        </h1>
        <p className="text-gray-500 dark:text-gray-200">
          Danh sách tất cả các nhân viên giao hàng trong hệ thống
        </p>
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={shipperList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={shipperList?.length || 0}
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
