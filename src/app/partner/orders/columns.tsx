"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatOrderStatusColor,
  formatOrderStatusText,
} from "@/src/utils/formatStatus";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { Lock, Unlock } from "lucide-react";

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
    accessorKey: "storeName",
    header: "Cửa hàng",
    cell: ({ row }) => {
      const value = row.getValue("storeName") as string;
      return <span className="font-medium text-blue-600">{value}</span>;
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
    accessorKey: "isLocked",
    header: "Chốt sổ",
    cell: ({ row }) => {
      const isLocked = row.getValue("isLocked") as boolean;

      return isLocked ? (
        <div
          className="flex justify-left text-amber-500"
          title="Đã chốt sổ cuối tháng"
        >
          <Lock size={18} />
        </div>
      ) : (
        <div className="flex justify-left text-slate-300">
          <Unlock size={18} />
        </div>
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
