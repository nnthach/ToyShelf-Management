"use client";

import { ProductCategory } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Edit, Eye, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductCategoryColumns = (
  onEdit: (categoryId: string) => void,
  onDelete: (categoryId: string) => void,
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
      const color = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onEdit(color.id)}
            title="Chi tiết"
            className="cursor-pointer text-blue-400"
          >
            <Edit size={20} />
          </span>
          <span
            onClick={() => onDelete(color.id)}
            title="Xóa"
            className="cursor-pointer text-red-400"
          >
            <Trash size={20} />
          </span>
        </div>
      );
    },
  },
];
