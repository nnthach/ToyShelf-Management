"use client";

import { Report } from "@/src/types";
import { ColumnDef } from "@tanstack/react-table";
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
  onView: (report: Report) => void,
): ColumnDef<Report>[] => [
  {
    accessorKey: "store",
    header: "Cửa hàng",
  },
  {
    accessorKey: "staffId",
    header: "Nhân viên",
  },
  {
    accessorKey: "rating",
    header: "Đánh giá",
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const report = row.original;
      return <ReportActionCell report={report} onView={onView} />;
    },
  },
];
