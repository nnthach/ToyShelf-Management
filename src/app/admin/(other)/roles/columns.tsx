"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Role } from "@/src/types";
import { Edit, Lock, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getRoleColumns = (
  onEdit: (roleId: string) => void,
  onDelete: (roleId: string) => void,
): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Tên",
  },

  {
    accessorKey: "description",
    header: "Mô tả",
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onDelete(role.id)}
            title="Vô hiệu hóa"
            className="cursor-pointer text-red-400"
          >
            <Lock size={20} />
          </span>
          <span
            onClick={() => onEdit(role.id)}
            title="Chi tiết"
            className="cursor-pointer text-blue-400"
          >
            <Edit size={20} />
          </span>
        </div>
      );
    },
  },
];
