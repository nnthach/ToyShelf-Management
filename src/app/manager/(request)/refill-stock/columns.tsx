"use client";

import { RefillRequest, Store } from "@/src/types";
import {
  formatStoreCreateRequestStatusColor,
  formatStoreCreateRequestStatusText,
  formatStoreOrderRefillRequestStatusColor,
  formatStoreOrderRefillRequestStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStoreRefillRequestColumns = (
  onEdit: (requestId: string) => void,
): ColumnDef<RefillRequest>[] => [
  {
    accessorKey: "code",
    header: "Mã",
  },
  {
    accessorKey: "storeName",
    header: "Cửa hàng yêu cầu",
  },

  {
    accessorKey: "requestName",
    header: "Tài khoản yêu cầu",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <span className={`${formatStoreOrderRefillRequestStatusColor(status)}`}>
          {formatStoreOrderRefillRequestStatusText(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const storeRefillRequest = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onEdit(storeRefillRequest.id)}
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
