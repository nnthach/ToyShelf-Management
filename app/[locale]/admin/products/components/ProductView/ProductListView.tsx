"use client";

import { DataTable } from "@/shared/styles/components/ui/data-table";
import { getProductColumns } from "../../columns";
import { useTranslations } from "next-intl";
import { Product } from "@/shared/types";
import { Button } from "@/shared/styles/components/ui/button";
import { Download, Upload } from "lucide-react";

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
  const tColumnTable = useTranslations("admin.tableColumn");
  const tButton = useTranslations("admin.button");
  const tStatus = useTranslations("status.isActive");

  const columns = getProductColumns(tColumnTable, tStatus, handleViewDetail);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={productList} isLoading={isLoading}>
        <div className="p-4 border-b flex justify-between items-center">
          {/*Filter search */}
          {children}
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
