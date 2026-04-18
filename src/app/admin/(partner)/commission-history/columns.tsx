"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CommissionHistory } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getCommissionHistoryColumns =
  (): ColumnDef<CommissionHistory>[] => [
    {
      accessorKey: "orderCode",
      header: "Mã đơn hàng",
    },
    {
      accessorKey: "appliedRate",
      header: "Phần trăm áp dụng",
    },

    {
      accessorKey: "commissionAmount",
      header: "Hoa hồng",
    },

    {
      accessorKey: "quantity",
      header: "Số lượng",
    },
    {
      accessorKey: "paymentMethod",
      header: "Phương thức thanh toán",
    },

    {
      accessorKey: "orderDate",
      header: "Ngày tạo đơn",
      cell: ({ row }) => {
        const commissionHistory = row.original;
        return (
          <span>{formatDateTime(commissionHistory.orderDate || "").full}</span>
        );
      },
    },
  ];
