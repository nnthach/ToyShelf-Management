"use client";

import { Store } from "@/src/types";
import {
  formatStoreCreateRequestStatusColor,
  formatStoreCreateRequestStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStoreCreateRequestColumns = (
  onDelete: (storeCreateRequestId: string) => void,
): ColumnDef<Store>[] => [
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
  },
  {
    accessorKey: "storeAddress",
    header: "Địa chỉ",
    cell: ({ row }) => {
      const storeAddress = row.getValue("storeAddress") as string;

      return (
        <div className="w-[200px]">
          <p className="text-sm text-gray-700 line-clamp-2">{storeAddress}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <span className={`${formatStoreCreateRequestStatusColor(status)}`}>
          {formatStoreCreateRequestStatusText(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const storeCreateRequest = row.original;
      return (
          <span
            onClick={() => onDelete(storeCreateRequest.id)}
            title="Xóa"
            className="cursor-pointer text-red-400"
          >
            <Trash size={20} />
          </span>
      );
    },
  },
];
