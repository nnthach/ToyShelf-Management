"use client";

import { User } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStaffColumns = (
  onViewDetail: (partnerId: string) => void,
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
    accessorKey: "storeName",
    header: "Cửa hàng",
  },

  {
    accessorKey: "storeRole",
    header: "Chức vụ",
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
