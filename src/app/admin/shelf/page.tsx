"use client";

import { Download, Plus, Upload } from "lucide-react";

import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import { useRouter } from "next/navigation";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { getCabinetColumns } from "./columns";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { useState } from "react";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { QueryParams } from "@/src/types/SubType";
import { Cabinet } from "@/src/types";
import { getAllShelfAPI } from "@/src/services/shelf.service";

export default function AdminCabinetManage() {
  const router = useRouter();

  const [selectedCabinetId, setSelectCabinetId] = useState<string | null>(null);

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: undefined,
    search: undefined,
  });

  const {
    data: shelfList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shelfs", query],
    queryFn: () => getAllShelfAPI(query),
    select: (res) => res.data as Cabinet[],
  });

  const handleViewDetail = (productId: string) => {
    setSelectCabinetId(productId);
  };

  const columns = getCabinetColumns(handleViewDetail);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý kệ
          </h1>
          <p className="text-gray-500 dark:text-gray-200">Danh sách kệ</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="btn-primary-gradient"
            onClick={() => router.push("/admin/cabinets/create")}
          >
            <Plus /> Thêm kệ mới
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={shelfList} isLoading={isLoading}>
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={shelfList.length}
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

      <ViewDetailSheet
        cabinetId={selectedCabinetId}
        isOpen={!!selectedCabinetId}
        onClose={() => setSelectCabinetId(null)}
      />
    </>
  );
}
