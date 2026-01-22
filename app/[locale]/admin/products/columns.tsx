"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/shared/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/shared/utils/formatStatus";
import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductColumns = (
  t: (key: string) => string,
  tStatus: (key: string) => string,
  onViewDetail: (productId: string) => void,
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
    accessorKey: "name",
    header: t("productName"),
  },
  {
    accessorKey: "productCategoryId",
    header: t("category"),
  },

  {
    accessorKey: "ageRange",
    header: t("ageRange"),
  },

  {
    accessorKey: "price",
    header: t("price"),
  },
  {
    accessorKey: "isActive",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.getValue("isActive") as boolean;

      return (
        <span className={`${formatUserStatusColor(status)}`}>
          {tStatus(formatUserStatusText(status))}
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
        <span
          onClick={() => onViewDetail(product?.id)}
          title="Detail"
          className="cursor-pointer text-blue-400"
        >
          <Eye />
        </span>
      );
    },
  },
];
