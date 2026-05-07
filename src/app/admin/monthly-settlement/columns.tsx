"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MonthlySettlement } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatMonthlySettlementStatusColor,
  formatMonthlySettlementStatusText,
} from "@/src/utils/formatStatus";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const ActionCell = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <span
      onClick={() => router.push(`/admin/monthly-settlement/${id}`)}
      className="cursor-pointer text-blue-400"
    >
      <Eye />
    </span>
  );
};

export const getMonthlySettlementColumns =
  (): ColumnDef<MonthlySettlement>[] => [
    {
      accessorKey: "partnerName",
      header: "Đối tác",
      cell: ({ row }) => {
        const partnerName = row.getValue("partnerName") as string;
        return (
          <span className="block max-w-[200px] truncate" title={partnerName}>
            {partnerName}
          </span>
        );
      },
    },
    {
      accessorKey: "month-year",
      header: "Tháng năm",
      cell: ({ row }) => {
        const month = row.original.month;
        const year = row.original.year;
        return `${month}/${year}`;
      },
    },
    {
      accessorKey: "totalSalesAmount",
      header: "Tổng tiền bán được",
      cell: ({ row }) => {
        const value = row.getValue("totalSalesAmount") as number;
        return value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },

    {
      accessorKey: "finalAmount",
      header: "Tổng tiền nhận được",
      cell: ({ row }) => {
        const value = row.getValue("finalAmount") as number;
        return value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },

    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        return (
          <span className={`${formatMonthlySettlementStatusColor(status)}`}>
            {formatMonthlySettlementStatusText(status)}
          </span>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const value = row.getValue("createdAt") as string;
        return <span>{formatDateTime(value).full}</span>;
      },
    },
    {
      accessorKey: "action",
      header: "Thao tác",
      cell: ({ row }) => <ActionCell id={row.original.id} />,
    },
  ];
