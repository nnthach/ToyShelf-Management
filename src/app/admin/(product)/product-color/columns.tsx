"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Color } from "@/src/types";
import { Edit, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductColorColumns = (
  onEdit: (colorId: string) => void,
  onDelete: (colorId: string) => void,
): ColumnDef<Color>[] => [
  {
    id: "colorPreview",
    accessorKey: "hexCode",
    header: "Màu",
    cell: ({ row }) => {
      const hex = row.original.hexCode;

      return (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: hex }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên",
  },

  {
    accessorKey: "hexCode",
    header: "HEX",
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
