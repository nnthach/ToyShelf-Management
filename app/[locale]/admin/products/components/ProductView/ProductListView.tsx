import { DataTable } from "@/shared/styles/components/ui/data-table";
import { getProductColumns } from "../../columns";
import { useTranslations } from "next-intl";
import { Product } from "@/shared/types";
import FilterSearchBar from "@/shared/components/FilterSearchBar";
import { QueryParams } from "@/shared/types/SubType";
import { ChangeEvent } from "react";
import { Button } from "@/shared/styles/components/ui/button";
import { Download, Upload } from "lucide-react";

interface ProductListViewProps {
  productList: Product[];
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

function ProductListView({
  productList,
  isLoading,
  tempFilter,
  handleChangeFilter,
  handleLimitChange,
  handleApplyFilters,
  query,
  updateQuery,
  handleResetAllQueryParams,
}: ProductListViewProps) {
  const tColumnTable = useTranslations("admin.tableColumn");
  const tButton = useTranslations("admin.button");

  const columns = getProductColumns(tColumnTable);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={productList} isLoading={isLoading}>
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
          />
          <div className="space-x-3">
            <Button className="cursor-pointer">
              <Download /> {tButton("import")}
            </Button>
            <Button variant={"outline"} className="cursor-pointer">
              <Upload /> {tButton("export")}
            </Button>
          </div>
        </div>
      </DataTable>
    </div>
  );
}

export default ProductListView;
