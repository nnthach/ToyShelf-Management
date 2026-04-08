"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getProductColumns } from "../../columns";

import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Product } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";

interface ProductListViewProps {
  productList: Product[];
  isLoading: boolean;
  children: React.ReactNode;
  handleViewDetail: (productId: string) => void;
  query: QueryParams;
  updateQuery: (params: Partial<QueryParams>) => void;
}

function ProductListView({
  productList,
  isLoading,
  children,
  query,
  handleViewDetail,
  updateQuery,
}: ProductListViewProps) {
  const columns = getProductColumns(handleViewDetail);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={productList}
        isLoading={isLoading}
        pageSize={query.pageSize}
        onPageChange={(newPage) => updateQuery({ pageNumber: newPage + 1 })}
      >
        <div className="p-4 border-b flex justify-between items-center">
          {/*Filter search */}
          {children}
        </div>
      </DataTable>
    </div>
  );
}

export default ProductListView;
