"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Report } from "@/shared/types";
import { Eye } from "lucide-react";

function ReportActionCell({
  report,
  onView,
}: {
  report: Report;
  onView: (report: Report) => void;
}) {
  return (
    <button
      onClick={() => onView(report)}
      title="Detail"
      className="text-blue-500 hover:text-blue-700"
    >
      <Eye size={18} />
    </button>
  );
}

export const getReportColumns = (
  t: (key: string) => string,
  onView: (report: Report) => void,
): ColumnDef<Report>[] => [
  {
    accessorKey: "store",
    header: t("store"),
  },
  {
    accessorKey: "staffId",
    header: t("staffId"),
  },
  {
    accessorKey: "rating",
    header: t("rating"),
  },

  {
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const report = row.original;
      return <ReportActionCell report={report} onView={onView} />;
    },
  },
];
