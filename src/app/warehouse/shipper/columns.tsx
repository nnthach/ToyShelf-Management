"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { WarehouseStaff } from "@/src/types";
import { formatDateTime, formatWarehouseRoleToVN } from "@/src/utils/format";
import {
  formatSystemRoleColor,
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { Eye } from "lucide-react";

export const getShipperColumns = (): ColumnDef<WarehouseStaff>[] => [
  {
    accessorKey: "fullName",
    header: "Tên đầy đủ",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "warehouseName",
    header: "Kho làm việc",
  },

  {
    accessorKey: "warehouseRole",
    header: "Chức vụ",
    cell: ({ row }) => {
      const role = row.getValue("warehouseRole") as string;

      return (
        <span className={`${formatSystemRoleColor(role)}`}>
          {formatWarehouseRoleToVN(role)}
        </span>
      );
    },
  },

  {
    accessorKey: "userIsActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("userIsActive") as boolean;

      return (
        <span className={`${formatUserStatusColor(status)}`}>
          {formatUserStatusText(status)}
        </span>
      );
    },
  },

  {
    accessorKey: "userCreatedAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const value = row.getValue("userCreatedAt") as string;
      return <span>{formatDateTime(value).full}</span>;
    },
  },
];
