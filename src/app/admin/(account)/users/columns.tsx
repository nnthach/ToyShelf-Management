"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "types";
import { formatDateTime } from "utils/format";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "utils/formatStatus";
import ViewDetailSheet from "./components/ViewDetailSheet";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Full name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "membership",
    header: "Membership",
    cell: ({ row }) => {
      const membership = row.getValue("membership") as string;

      return (
        <span className={`${formatUserStatusColor(membership)}`}>
          {/* {formatUserStatusText(status)} */}
          Basic
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <span className={`${formatUserStatusColor(status)}`}>
          {formatUserStatusText(status)}
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return <span>{formatDateTime(value).full}</span>;
    },
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return <ViewDetailSheet user={user} />;
    },
  },
];
