"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product, User } from "@/shared/types";

import ViewDetailSheet from "./components/ViewDetailSheet";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/shared/utils/formatStatus";
import { formatDateTime } from "@/shared/utils/format";
import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductColumns = (
  t: (key: string) => string
): ColumnDef<Product>[] => [
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
    accessorKey: "sku",
    header: t("sku"),
  },
  {
    accessorKey: "title",
    header: t("productName"),
  },
  {
    accessorKey: "category",
    header: t("category"),
  },

  {
    accessorKey: "price",
    header: t("price"),
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;

      return (
        <span className={`${formatUserStatusColor(status)}`}>
          {formatUserStatusText(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <ViewDetailSheet product={product}>
          <span title="Detail" className="cursor-pointer text-blue-400">
            <Eye />
          </span>
        </ViewDetailSheet>
      );
    },
  },
];
