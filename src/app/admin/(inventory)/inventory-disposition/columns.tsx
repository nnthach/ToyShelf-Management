"use client";

import { InventoryDisposition } from "@/src/types";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getInventoryDispositionColumns = (
  onEdit: (inventoryDispositionId: string) => void,
  onDelete: (inventoryDispositionId: string) => void,
): ColumnDef<InventoryDisposition>[] => [
  {
    accessorKey: "code",
    header: "Mã trạng thái",
  },

  {
    accessorKey: "description",
    header: "Mô tả",
  },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const inventoryDisposition = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onEdit(inventoryDisposition.id)}
            title="Chi tiết"
            className="cursor-pointer text-blue-400"
          >
            <Edit size={20} />
          </span>
          <span
            onClick={() => onDelete(inventoryDisposition.id)}
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
