import { DataTable } from "@/shared/styles/components/ui/data-table";
import { getProductColumns } from "../../columns";
import { useTranslations } from "next-intl";
import { Product } from "@/shared/types";
import FilterSearchBar from "@/shared/components/FilterSearchBar";
import { QueryParams } from "@/shared/types/SubType";
import { ChangeEvent } from "react";
import { Button } from "@/shared/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { ProductStatus } from "@/shared/enums/product-status.enum";
import { PRODUCT_STATUS_OPTIONS } from "@/shared/constants/product-status";

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
  const tStatus = useTranslations("status.products");

  const columns = getProductColumns(tColumnTable);

  const statusOptions = PRODUCT_STATUS_OPTIONS.map((status) => ({
    value: status.value,
    label: tStatus(status.label),
  }));

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

export default ProductListView;
