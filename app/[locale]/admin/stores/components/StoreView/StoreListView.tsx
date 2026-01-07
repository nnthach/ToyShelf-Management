import { DataTable } from "@/shared/styles/components/ui/data-table";
import { useTranslations } from "next-intl";
import { Product, Store } from "@/shared/types";
import FilterSearchBar from "@/shared/components/FilterSearchBar";
import { QueryParams } from "@/shared/types/SubType";
import { ChangeEvent } from "react";
import { Button } from "@/shared/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { getStoreColumns } from "../../columns";
import { STORE_STATUS_OPTIONS } from "@/shared/constants/store-status";

interface StoreListViewProps {
  storeList: Store[];
  isLoading: boolean;
  tempFilter: {
    order: string;
    status: string;
    limit: number;
  };
  handleChangeFilter: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleLimitChange: (value: number) => void;
  handleApplyFilters: () => void;
  query: QueryParams;
  updateQuery: (newQuery: Partial<QueryParams>) => void;
  handleResetAllQueryParams: () => void;
}

function StoreListView({
  storeList,
  isLoading,
  tempFilter,
  handleChangeFilter,
  handleLimitChange,
  handleApplyFilters,
  query,
  updateQuery,
  handleResetAllQueryParams,
}: StoreListViewProps) {
  const tColumnTable = useTranslations("admin.tableColumn");
  const tButton = useTranslations("admin.button");
  const tStatus = useTranslations("status.stores");

  const columns = getStoreColumns(tColumnTable);

  const statusOptions = STORE_STATUS_OPTIONS.map((status) => ({
    value: status.value,
    label: tStatus(status.label),
  }));

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={storeList} isLoading={isLoading}>
        <div className="p-4 border-b flex justify-between items-center">
          {/*Filter search */}
          <FilterSearchBar
            tempFilter={tempFilter}
            onFilterChange={handleChangeFilter}
            onLimitChange={handleLimitChange}
            onApplyFilters={handleApplyFilters}
            query={{ search: query.search || "" }}
            updateQuery={updateQuery}
            reset={handleResetAllQueryParams}
            selectStatusData={statusOptions}
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
  );
}

export default StoreListView;
