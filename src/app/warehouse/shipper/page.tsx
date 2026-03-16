"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getShipperColumns } from "./columns";
import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import CreateStaffModal from "./components/CreateShipperModal";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { getAllUserAPI } from "@/src/services/user.service";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";

export default function WarehouseShipperManage() {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const {
    data: shipperList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shippers", query],
    queryFn: () => getAllUserAPI(query),
    select: (res) => res.data,
  });

  const columns = getShipperColumns();

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý nhân viên giao hàng</h1>
        <CreateStaffModal />
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
              resultCount={shipperList.length}
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
