"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CommissionHistory } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import ViewDetailSheet from "./components/ViewDetailSheet";
import {
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";

export const getCommissionHistoryColumns =
  (): ColumnDef<CommissionHistory>[] => [
    {
      accessorKey: "orderCode",
      header: "Mã đơn hàng",
      cell: ({ row }) => (
        <span className="font-medium text-blue-600">
          {row.getValue("orderCode")}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng số tiền",
      cell: ({ row }) => {
        const value = Number(row.getValue("totalAmount") || 0);
        return (
          <span className="text-gray-600">
            {value.toLocaleString("vi-VN")}đ
          </span>
        );
      },
    },
    {
      accessorKey: "totalCommission",
      header: "Hoa hồng",
      cell: ({ row }) => {
        const value = Number(row.getValue("totalCommission") || 0);
        return (
          <span className="font-bold text-green-600">
            +{value.toLocaleString("vi-VN")}đ
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        return (
          <span className={`${formatOrderStatusColor(status)}`}>
            {formatOrderStatusText(status)}
          </span>
        );
      },
    },
    {
      accessorKey: "orderDate",
      header: "Ngày tạo đơn",
      cell: ({ row }) => {
        const date = row.original.orderDate;
        return (
          <span className="text-gray-500 italic">
            {formatDateTime(date || "").full}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => <ViewDetailSheet orderCode={row.original.orderCode} />,
    },
  ];
