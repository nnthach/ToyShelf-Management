"use client";

import { StoreInvite, User } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatStoreInviteStatusColor,
  formatStoreInviteStatusText,
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStoreInviteColumns = (
  onDelete: (inviteId: string) => void,
): ColumnDef<StoreInvite>[] => [
  {
    accessorKey: "storeId",
    header: "Tên cửa hàng",
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "storeRole",
    header: "Chức vụ",
  },

  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <span className={`${formatStoreInviteStatusColor(status)}`}>
          {formatStoreInviteStatusText(status)}
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
      const invite = row.original;
      return (
        <span
          onClick={() => onDelete(invite.id)}
          title="Xóa"
          className="cursor-pointer text-red-400"
        >
          <Trash size={20} />
        </span>
      );
    },
  },
];
