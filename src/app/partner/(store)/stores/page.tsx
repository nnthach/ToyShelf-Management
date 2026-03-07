"use client";

import { Download, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import { useRouter } from "next/navigation";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { getAllStoreAPI } from "@/src/services/store.service";
import { Store } from "@/src/types";
import CreateStoreModal from "./components/CreateStoreModal";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStoreColumns } from "./columns";

export default function PartnerStoreManage() {
  const router = useRouter();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const { data: storeList = [], isLoading } = useQuery({
    queryKey: ["stores", query],
    queryFn: () => getAllStoreAPI(query),
    select: (res) => res.data as Store[],
  });

  const columns = getStoreColumns();

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Quản lý cửa hàng</h1>
        <CreateStoreModal />
      </div>

      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={storeList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={storeList.length}
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
                <Download /> Nhập khẩu
              </Button>
              <Button variant={"outline"}>
                <Upload /> Xuất khẩu
              </Button>
            </div>
          </div>
        </DataTable>
      </div>
    </>
  );
}
