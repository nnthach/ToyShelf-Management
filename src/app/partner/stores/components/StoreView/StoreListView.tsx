import { DataTable } from "@/src/styles/components/ui/data-table";

import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { getStoreColumns } from "../../columns";
import { Store } from "@/src/types";

interface StoreListViewProps {
  storeList: Store[];
  isLoading: boolean;
  children: React.ReactNode;
}

function StoreListView({ storeList, isLoading, children }: StoreListViewProps) {
  const columns = getStoreColumns();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={storeList} isLoading={isLoading}>
        <div className="p-4 border-b flex justify-between items-center">
          {/*Filter search */}
          {children}

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
  );
}

export default StoreListView;
