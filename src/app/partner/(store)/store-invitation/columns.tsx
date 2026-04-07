"use client";

import { StoreInvite, User } from "@/src/types";
import { formatDateTime, formatStoreRoleToVN } from "@/src/utils/format";
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
    cell: ({ row }) => {
      const storeRole = row.getValue("storeRole") as string;

      return (
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
            storeRole === "Manager"
              ? "bg-amber-100/50 text-amber-700 border border-amber-200/50"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {formatStoreRoleToVN(storeRole)}
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
