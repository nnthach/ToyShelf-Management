"use client";
import { useTranslations } from "next-intl";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/styles/components/ui/sheet";

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/shared/styles/components/ui/card";
import { DollarSign } from "lucide-react";
import { ScrollArea } from "@/shared/styles/components/ui/scroll-area";
import { DataTable } from "@/shared/styles/components/ui/data-table";
import { getReportColumns } from "./ReportColumn";
import { ReportFakeData } from "@/shared/constants/fakeData";
import { useState } from "react";
import ReportDetailModal from "./ReportDetailModal";
import { Report } from "@/shared/types";

function ViewStoreFeedbackSheet({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin.partners.viewPartner.viewPartnerSheet");
  const tColumnTable = useTranslations("admin.tableColumn");
  const tButton = useTranslations("admin.button");

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };
  const columns = getReportColumns(tColumnTable, handleViewReport);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full !max-w-[800px]">
          <SheetHeader className="pb-0">
            <SheetTitle className="">
              <h1 className="text-xl">Feedback List</h1>
            </SheetTitle>
          </SheetHeader>
          <div className="flex bg-gray-200 dark:bg-muted h-full p-4">
            <div className="w-full">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                          <DollarSign className="text-white dark:text-black" />
                        </div>
                        <p className="text-primary text-lg">Total Sales</p>
                      </div>

                      <p className="text-xl font-bold text-primary">
                        19,000,000 VND
                      </p>
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Card 2 */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                          <DollarSign className="text-white dark:text-black" />
                        </div>
                        <p className="text-primary text-lg">Net Revenue</p>
                      </div>

                      <p className="text-xl font-bold text-primary">
                        9,000,000 VND
                      </p>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* --- Recent Payments to Franchise Partner --- */}
              <div className="mt-4 border rounded-xl bg-background overflow-hidden">
                {/* Header */}
                <div className="border-b px-4 py-3">
                  <p className="font-semibold">
                    Reports <span className="text-gray-500">(9)</span>
                  </p>
                  <p className="text-sm text-gray-500">Everyday reports</p>
                </div>

                {/* List */}
                <DataTable columns={columns} data={ReportFakeData} />
              </div>
            </div>
          </div>
          {selectedReport && (
            <ReportDetailModal setSelectedReport={setSelectedReport} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default ViewStoreFeedbackSheet;
