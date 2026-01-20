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
import { ReportFakeData, StaffFakeData } from "@/shared/constants/fakeData";
import { useState } from "react";
import ReportDetailModal from "./ReportDetailModal";
import { Report } from "@/shared/types";

function ViewStoreStaffSheet({ children }: { children: React.ReactNode }) {
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
              <h1 className="text-xl">Staff List</h1>
            </SheetTitle>
          </SheetHeader>
          <div className="flex bg-gray-200 dark:bg-muted h-full p-4">
            <div className="w-full">
              <table className="w-full text-sm bg-background">
                {/* Header */}
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">Full Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y">
                  {StaffFakeData.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50 transition">
                      {/* Full name */}
                      <td className="px-4 py-3 font-medium">
                        {staff.fullName}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-gray-500">{staff.email}</td>

                      {/* Role */}
                      <td className="px-4 py-3">{staff.role}</td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-md ${
                            staff.status === "active"
                              ? "bg-green-100 text-green-700"
                              : staff.status === "inactive"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default ViewStoreStaffSheet;
