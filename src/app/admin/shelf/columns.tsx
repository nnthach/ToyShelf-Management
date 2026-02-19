"use client";

import { Cabinet } from "@/src/types";
import { formatUserStatusColor, formatUserStatusText } from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getCabinetColumns = (
  onViewDetail: (cabinetId: string) => void,
): ColumnDef<Cabinet>[] => [
  {
    accessorKey: "name",
    header: "Tên",
  },

  {
    accessorKey: "storeId",
    header: "Cửa hàng",
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
      const cabinet = row.original;
      return (
        <span
          onClick={() => onViewDetail(cabinet?.id)}
          title="Chi tiết"
          className="cursor-pointer text-blue-400"
        >
          <Eye />
        </span>
      );
    },
  },
];
