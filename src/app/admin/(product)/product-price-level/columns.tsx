"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductPriceSegment } from "@/src/types";
import { Edit, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductPriceSegmentColumns = (
  onEdit: (colorId: string) => void,
  onDelete: (colorId: string) => void,
): ColumnDef<ProductPriceSegment>[] => [
  {
    accessorKey: "name",
    header: "Tên",
  },

  {
    accessorKey: "minPrice",
    header: "Gía từ",
  },

  {
    accessorKey: "maxPrice",
    header: "Gía đến",
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const productPriceSegment = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onEdit(productPriceSegment.id)}
            title="Chi tiết"
            className="cursor-pointer text-blue-400"
          >
            <Edit size={20} />
          </span>
          <span
            onClick={() => onDelete(productPriceSegment.id)}
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
