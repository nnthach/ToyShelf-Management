"use client";

import useQueryParams from "@/shared/hooks/useQueryParams";
import { DataTable } from "@/shared/styles/components/ui/data-table";
import { QueryParams } from "@/shared/types/SubType";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FilterSearch from "./components/FilterSearch";
import { Button } from "@/shared/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { getWarehouseColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { getAllWarehouseAPI } from "@/shared/services/warehouse.service";
import ViewDetailSheet from "./components/ViewDetailSheet";
import CreateWarehouseModal from "./components/CreateWarehouseModal";

export default function AdminWarehouseManagement() {
  const t = useTranslations("admin.warehouse");
  const tButton = useTranslations("admin.button");
  const tColumnTable = useTranslations("admin.tableColumn");

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: undefined,
    search: undefined,
  });

  const { data: warehouseList = [], isLoading } = useQuery({
    queryKey: ["warehouses", query],
    queryFn: () => getAllWarehouseAPI(query),
    select: (res) => res.data,
  });

  const handleViewDetail = (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId);
  };

  const columns = getWarehouseColumns(tColumnTable, handleViewDetail);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{t("header")}</h1>
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

      <ViewDetailSheet
        warehouseId={selectedWarehouseId}
        isOpen={!!selectedWarehouseId}
        onClose={() => setSelectedWarehouseId(null)}
      />
    </>
  );
}
