"use client";

import { ColumnDef } from "@tanstack/react-table";

import ViewDetailSheet from "./components/ViewDetailSheet";
import { User } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { formatDateTime } from "@/src/utils/format";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
      return <ViewDetailSheet user={user} />;
    },
  },
];
