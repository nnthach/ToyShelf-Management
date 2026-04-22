"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CommissionHistory } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";

export const getCommissionHistoryColumns =
  (): ColumnDef<CommissionHistory>[] => [
    {
      accessorKey: "orderCode",
      header: "Mã đơn hàng",
    },
    {
      accessorKey: "appliedRate",
      header: "Phần trăm áp dụng",
      cell: ({ row }) => {
        const commissionHistory = row.original;
        return (
          <span>{Number(commissionHistory?.appliedRate || 0) * 100}%</span>
        );
      },
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
