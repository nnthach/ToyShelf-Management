"use client";

import { ProductCategory } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductCategoryColumns = (
  onViewDetail: (categoryId: string) => void,
): ColumnDef<ProductCategory>[] => [
  {
    accessorKey: "name",
    header: "Tên cấp độ giá sản phẩm",
  },

  {
    accessorKey: "description",
    header: "Mô tả",
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
    accessorKey: "action",
    header: "Hành động",
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
