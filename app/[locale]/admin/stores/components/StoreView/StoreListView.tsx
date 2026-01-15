import { DataTable } from "@/shared/styles/components/ui/data-table";
import { useTranslations } from "next-intl";
import { Store } from "@/shared/types";

import { Button } from "@/shared/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import { getStoreColumns } from "../../columns";

interface StoreListViewProps {
  storeList: Store[];
  isLoading: boolean;
  children: React.ReactNode;
}

function StoreListView({ storeList, isLoading, children }: StoreListViewProps) {
  const tColumnTable = useTranslations("admin.tableColumn");
  const tButton = useTranslations("admin.button");
  const tStatus = useTranslations("status.stores");

  const columns = getStoreColumns(tColumnTable);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={storeList} isLoading={isLoading}>
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

export default StoreListView;
