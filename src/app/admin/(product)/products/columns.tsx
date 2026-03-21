"use client";

import { Product } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductColumns = (
  onViewDetail: (productId: string) => void,
): ColumnDef<Product>[] => [
  {
    accessorKey: "sku",
    header: "Mã sản phẩm",
  },
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
  },
  {
    accessorKey: "productCategoryId",
    header: "Danh mục",
  },

  {
    accessorKey: "brand",
    header: "Thương hiệu",
  },

  {
    accessorKey: "basePrice",
    header: "Gía tiền",
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
