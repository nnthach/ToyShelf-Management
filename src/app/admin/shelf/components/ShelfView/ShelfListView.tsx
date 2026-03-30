"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Shelf } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { getShelfTypeColumns } from "../../columns";

interface ShelfListViewProps {
  shelfList: Shelf[];
  isLoading: boolean;
  children: React.ReactNode;
  handleViewDetail: (shelfId: string) => void;
  query: QueryParams;
  updateQuery: (params: Partial<QueryParams>) => void;
}

function ShelfListView({
  shelfList,
  isLoading,
  children,
  query,
  handleViewDetail,
  updateQuery,
}: ShelfListViewProps) {
  const columns = getShelfTypeColumns(handleViewDetail);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={shelfList}
        isLoading={isLoading}
        pageSize={query.pageSize}
        onPageChange={(newPage) => updateQuery({ pageNumber: newPage + 1 })}
      >
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

export default ShelfListView;
