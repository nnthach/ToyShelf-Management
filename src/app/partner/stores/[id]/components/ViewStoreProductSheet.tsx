"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/src/styles/components/ui/card";
import { DollarSign } from "lucide-react";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { useState } from "react";
import { getProductColumns } from "./ProductColumn";
import { Product } from "@/src/types";

function ViewStoreProductSheet({ children }: { children: React.ReactNode }) {
  const handleViewReport = (product: Product) => {
    setSelectedReport(product);
  };
  const columns = getProductColumns((key: string) => key, handleViewReport);

  const [selectedReport, setSelectedReport] = useState<Product | null>(null);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full !max-w-[800px]">
          <SheetHeader className="pb-0">
            <SheetTitle className="">
              <h1 className="text-xl">Danh sách sản phẩm</h1>
            </SheetTitle>
          </SheetHeader>
          <div className="flex bg-gray-200 dark:bg-muted h-full p-4">
            <div className="w-full">
              <div className="grid grid-cols-3 gap-4">
                {/* Card 2 */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                          <DollarSign className="text-white dark:text-black" />
                        </div>
                        <p className="text-primary text-lg">Doanh thu thực tế</p>
                      </div>

                      <p className="text-xl font-bold text-primary">
                        9,000,000 VND
                      </p>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* --- Recent Payments to Franchise Partner --- */}
              <div className="mt-4 border rounded-xl bg-background overflow-hidden h-[480px]">
                {/* Header */}
                <div className="border-b px-4 py-3">
                  <p className="font-semibold">
                    Sản phẩm{" "}
                    <span className="text-gray-500">danh sách sản phẩm</span>
                  </p>
                </div>

                {/* List */}
                {/* <DataTable
                  columns={columns}
                  data={ProductFakeData}
                  pageSize={6}
                /> */}
              </div>
            </div>
          </div>
          {/* {selectedReport && (
            <ReportDetailModal setSelectedReport={setSelectedReport} />
          )} */}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default ViewStoreProductSheet;
