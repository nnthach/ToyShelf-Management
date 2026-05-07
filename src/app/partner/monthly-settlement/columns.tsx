"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { MonthlySettlement } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatMonthlySettlementStatusColor,
  formatMonthlySettlementStatusText,
} from "@/src/utils/formatStatus";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const ActionCell = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <span
      onClick={() => router.push(`/partner/monthly-settlement/${id}`)}
      className="cursor-pointer text-blue-400"
    >
      <Eye />
    </span>
  );
};
export const getMonthlySettlementColumns =
  (): ColumnDef<MonthlySettlement>[] => [
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
      accessorKey: "month-year",
      header: "Tháng năm",
      cell: ({ row }) => {
        const month = row.original.month;
        const year = row.original.year;
        return `${month}/${year}`;
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
