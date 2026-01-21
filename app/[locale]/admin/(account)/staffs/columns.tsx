"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/shared/types";
import { formatDateTime } from "../../../../../shared/utils/format";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "../../../../../shared/utils/formatStatus";
import ViewDetailSheet from "./components/ViewDetailSheet";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStaffColumns = (
  t: (key: string) => string,
): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: t("fullName"),
  },
  {
    accessorKey: "email",
    header: t("email"),
  },

  {
    accessorKey: "workingArea",
    header: t("workingArea"),
    cell: ({ row }) => {
      // const workingArea = row.getValue("workingArea") as string;

      return (
        // <span className={`${formatUserStatusColor(workingArea)}`}>
        <span>
          {/* {formatUserStatusText(status)} */}1
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: t("status"),
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
    header: t("createdAt"),
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return <span>{formatDateTime(value).full}</span>;
    },
  },
  {
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const user = row.original;
      return <ViewDetailSheet user={user} />;
    },
  },
];
