"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductCategory, User } from "@/shared/types";
import ViewDetailSheet from "./components/ViewDetailSheet";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/shared/utils/formatStatus";
import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductCategoryColumns = (
  t: (key: string) => string,
  onViewDetail: (categoryId: string) => void,
): ColumnDef<ProductCategory>[] => [
  {
    accessorKey: "name",
    header: t("name"),
  },

  {
    accessorKey: "description",
    header: t("description"),
  },
  {
    accessorKey: "isActive",
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
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <span
          onClick={() => onViewDetail(category.id)}
          title="Detail"
          className="cursor-pointer text-blue-400"
        >
          <Eye />
        </span>
      );
    },
  },
];
