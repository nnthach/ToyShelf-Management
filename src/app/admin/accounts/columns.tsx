"use client";

import { ColumnDef } from "@tanstack/react-table";

import { User } from "@/src/types";
import {
  formatSystemBusinessRoleColor,
  formatSystemBusinessRoleText,
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { formatDateTime } from "@/src/utils/format";
import { Eye } from "lucide-react";

export const getStaffColumns = (
  onView: (userId: string) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: "Tên đầy đủ",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "businessRole",
    header: "Chức vụ",
    cell: ({ row }) => {
      const roles = row.getValue("businessRole") as string;

      return (
        <span className={`${formatSystemBusinessRoleColor(roles)}`}>
          {formatSystemBusinessRoleText(roles)}
        </span>
      );
    },
  },

  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("isActive") as boolean;

      return (
        <span className={`${formatUserStatusColor(status)}`}>
          {formatUserStatusText(status)}
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
      const user = row.original;

      if (
        user.businessRole === "warehouse_manager" ||
        user.businessRole === "warehouse_shipper"
      ) {
        return (
          <span
            onClick={() => onView(user.id)}
            title="Chi tiết"
            className="cursor-pointer text-blue-400"
          >
            <Eye size={20} />
          </span>
        );
      }
    },
  },
];
