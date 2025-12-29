"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product, User } from "@/shared/types";

import ViewDetailSheet from "./components/ViewDetailSheet";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/shared/utils/formatStatus";
import { formatDateTime } from "@/shared/utils/format";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductColumns = (
  t: (key: string) => string
): ColumnDef<Product>[] => [
  {
    accessorKey: "sku",
    header: t("sku"),
  },
  {
    accessorKey: "title",
    header: t("productName"),
  },
  {
    accessorKey: "brand",
    header: t("brand"),
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
    accessorKey: "stock",
    header: t("stock"),
  },
  {
    accessorKey: "status",
    header: t("status"),
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
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const product = row.original;
      return <ViewDetailSheet product={product} />;
    },
  },
];
