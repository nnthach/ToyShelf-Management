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
    accessorFn: (row) => row.images?.[0],
    id: "image",
    header: "Hình ảnh",
    cell: ({ getValue }) => (
      <img
        src={getValue() as string}
        className="w-12 h-12 object-cover rounded"
      />
    ),
  },
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
    accessorKey: "ageRange",
    header: "Độ tuổi",
  },

  {
    accessorKey: "price",
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
