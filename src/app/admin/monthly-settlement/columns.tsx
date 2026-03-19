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
      accessorKey: "month",
      header: "Tháng",
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
