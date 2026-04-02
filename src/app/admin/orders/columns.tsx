"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { Order } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getOrderColumns = (): ColumnDef<Order>[] => [
  {
    accessorKey: "storeName",
    header: "Cửa hàng",
  },
  {
    accessorKey: "customer",
    header: "Khách hàng",
    cell: ({ row }) => {
      const { customerName, customerPhone } = row.original;
      return (
        <div>
          <p className="font-semibold">{customerName}</p>
          <p className="text-xs text-muted-foreground">{customerPhone}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const totalAmount = row.getValue("totalAmount") as string;

      return <span>{totalAmount.toLocaleString()}đ</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Phương thức thanh toán",
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
    header: "Hành động",
    cell: ({ row }) => {
      const order = row.original;
      return <ViewDetailSheet orderCode={order.orderCode} />;
    },
  },
];
