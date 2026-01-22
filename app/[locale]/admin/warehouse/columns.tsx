"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Warehouse } from "@/shared/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/shared/utils/formatStatus";
import { Eye } from "lucide-react";

export const getWarehouseColumns = (
  t: (key: string) => string,
  onViewDetail: (warehouseId: string) => void,
): ColumnDef<Warehouse>[] => [
  {
    accessorKey: "name",
    header: t("name"),
  },

  {
    accessorKey: "address",
    header: t("address"),
  },

  {
    accessorKey: "isActive",
    header: t("status"),
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
    header: t("action"),
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
