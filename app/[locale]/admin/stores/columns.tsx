"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product, Store, User } from "@/shared/types";

import ViewDetailSheet from "./components/ViewDetailSheet";
import {
  formatStoreStatusColor,
  formatStoreStatusText,
  formatUserStatusColor,
  formatUserStatusText,
} from "@/shared/utils/formatStatus";
import { formatDateTime } from "@/shared/utils/format";
import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStoreColumns = (
  t: (key: string) => string
): ColumnDef<Store>[] => [
  {
    accessorFn: (row) => row.images?.[0],
    id: "image",
    header: t("image"),
    cell: ({ getValue }) => (
      <img
        src={getValue() as string}
        className="w-12 h-12 object-cover rounded"
      />
    ),
  },
  {
    accessorKey: "name",
    header: t("name"),
  },
  {
    accessorKey: "address",
    header: t("address"),
  },
  {
    accessorKey: "rating",
    header: t("rating"),
  },

  {
    header: t("workingTime"),
    cell: ({ row }) => {
      const { openTime, closeTime, openDay } = row.original;
      return (
        <span>
          {openDay}: {openTime} - {closeTime}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <span className={`${formatStoreStatusColor(status)}`}>
          {formatStoreStatusText(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const store = row.original;
      return (
        <ViewDetailSheet store={store}>
          <span title="Detail" className="cursor-pointer text-blue-400">
            <Eye />
          </span>
        </ViewDetailSheet>
      );
    },
  },
];
