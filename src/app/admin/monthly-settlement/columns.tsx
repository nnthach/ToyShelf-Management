"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { MonthlySettlement } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getMonthlySettlementColumns =
  (): ColumnDef<MonthlySettlement>[] => [
    {
      accessorKey: "partnerName",
      header: "Đối tác",
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
      accessorKey: "totalItems",
      header: "Tổng sản phẩm",
    },

    {
      accessorKey: "totalCommissionAmount",
      header: "Tổng tiền hoa hồng",
    },

    {
      accessorKey: "finalAmount",
      header: "Tổng tiền nhận được",
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
      header: "Hành động",
      cell: ({ row }) => {
        const monthlySettlement = row.original;
        return <ViewDetailSheet monthlySettlement={monthlySettlement} />;
      },
    },
  ];
