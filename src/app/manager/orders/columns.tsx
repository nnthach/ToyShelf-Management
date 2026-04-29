"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import ViewDetailSheet from "./components/ViewDetailSheet";
import {
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getOrderColumns = (): ColumnDef<Order>[] => [
  {
    accessorKey: "orderCode",
    header: "Mã đơn hàng",
    cell: ({ row }) => {
      const { orderCode } = row.original;
      return <p className="font-semibold">{orderCode}</p>;
    },
  },
  {
    accessorKey: "bankReference",
    header: "Mã giao dịch",
  },
  {
    accessorKey: "customer",
    header: "Khách hàng",
    cell: ({ row }) => {
      const { customerName, customerEmail } = row.original;
      return (
        <div>
          <p className="font-semibold">{customerName}</p>
          <p className="text-xs text-muted-foreground">{customerEmail}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const value = row.getValue("totalAmount") as number;
      return (
        <span className="font-semibold text-green-600">
          {value?.toLocaleString("vi-VN")}đ
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
    cell: ({ row }) => {
      const order = row.original;
      return <ViewDetailSheet orderCode={order.orderCode} />;
    },
  },
];
