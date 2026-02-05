"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getProductColumns } from "../../columns";

import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Product } from "@/src/types";

interface ProductListViewProps {
  productList: Product[];
  isLoading: boolean;
  children: React.ReactNode;
  handleViewDetail: (productId: string) => void;
}

function ProductListView({
  productList,
  isLoading,
  children,
  handleViewDetail,
}: ProductListViewProps) {
  const columns = getProductColumns( handleViewDetail);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={productList} isLoading={isLoading}>
        <div className="p-4 border-b flex justify-between items-center">
          {/*Filter search */}
          {children}
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
  );
}

export default ProductListView;
