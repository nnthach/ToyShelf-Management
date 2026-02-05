"use client";

import { Warehouse } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";

export const getWarehouseColumns = (
  onViewDetail: (warehouseId: string) => void,
): ColumnDef<Warehouse>[] => [
  {
    accessorKey: "name",
    header: "Tên",
  },

  {
    accessorKey: "address",
    header: "Địa chỉ",
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
      const warehouse = row.original;
      return (
        <span
          onClick={() => onViewDetail(warehouse.id)}
          title="Detail"
          className="cursor-pointer text-blue-400"
        >
          <Eye />
        </span>
      );
    },
  },
];
