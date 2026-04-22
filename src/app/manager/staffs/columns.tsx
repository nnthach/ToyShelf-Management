"use client";

import { User } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

export const getStaffColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: "Tên đầy đủ",
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "storeName",
    header: "Cửa hàng",
  },

  {
    accessorKey: "storeRole",
    header: "Chức vụ",
    cell: ({ row }) => {
      const role = row.getValue("storeRole");
      return role === "Staff" ? "Nhân viên cửa hàng" : "Quản lý cửa hàng";
    },
  },

  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;

      return (
        <span className={`${formatUserStatusColor(isActive)}`}>
          {formatUserStatusText(isActive)}
        </span>
      );
    },
  },
];
