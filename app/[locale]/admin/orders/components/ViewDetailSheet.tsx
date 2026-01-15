import { Eye } from "lucide-react";

import { Order } from "@/shared/types";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/styles/components/ui/sheet";

function ViewDetailSheet({ order }: { order: Order }) {
  const tViewDetailSheet = useTranslations("admin.users.viewDetailSheet");
  const tColumnTable = useTranslations("admin.tableColumn");

  return (
    <Sheet>
      <SheetTrigger>
        <span title="Detail" className="cursor-pointer text-blue-400">
          <Eye />
        </span>
      </SheetTrigger>
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>{tViewDetailSheet("header")}</SheetTitle>
          <SheetDescription>
            {tViewDetailSheet("subHeader")} <b>{order.id}</b>
          </SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Right */}
          <div className="bg-background flex-1 border-t border-border">
            <div className="flex flex-col divide-y divide-border">
              {/* Full name */}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tColumnTable("storeId")}
                </p>
                <p className="text-base font-bold">{order.storeId}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
