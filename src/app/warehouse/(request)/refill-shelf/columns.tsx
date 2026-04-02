"use client";

import { ShipmentAssign, Store } from "@/src/types";
import {
  formatShipmentAssignStatusColor,
  formatShipmentAssignStatusText,
  formatShipmentStatusColor,
  formatShipmentStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getShipmentAssignColumnColumns = (
  onEdit: (shipmentAssignId: string) => void,
): ColumnDef<ShipmentAssign>[] => [
  {
    accessorKey: "warehouseLocationName",
    header: "Từ kho",
  },
  {
    accessorKey: "storeLocationName",
    header: "Đến cửa hàng",
  },
  {
    accessorKey: "createdByName",
    header: "Người duyệt đơn",
  },
  {
    accessorKey: "shipperName",
    header: "Người giao hàng",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <span className={`${formatShipmentAssignStatusColor(status)}`}>
          {formatShipmentAssignStatusText(status)}
        </span>
      );
    },
  },

  {
    accessorKey: "shipmentStatus",
    header: "Trạng thái giao hàng",
    cell: ({ row }) => {
      const shipmentStatus = row.getValue("shipmentStatus") as string;

      return (
        <span className={`${formatShipmentStatusColor(shipmentStatus)}`}>
          {formatShipmentStatusText(shipmentStatus)}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const shipmentAssignRequest = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onEdit(shipmentAssignRequest.id)}
            title="Chi tiết"
            className="cursor-pointer text-blue-400"
          >
            <Eye size={20} />
          </span>
        </div>
      );
    },
  },
];
