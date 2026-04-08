"use client";

import { Store } from "@/src/types";
import {
  formatStoreCreateRequestStatusColor,
  formatStoreCreateRequestStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStoreCreateRequestColumns = (
  onDelete: (storeCreateRequestId: string) => void,
  onView: (storeCreateRequestId: string) => void,
): ColumnDef<Store>[] => [
  {
    accessorKey: "name",
    header: "Tên cửa hàng",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;

      return <p className="font-bold">{name}</p>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
  },
  {
    accessorKey: "cityName",
    header: "Thành phố",
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
      const status = row.getValue("status") as string;

      return (
        <div className="flex items-center gap-3">
          {status === "Pending" && (
            <span
              onClick={() => onDelete(storeCreateRequest.id)}
              title="Xóa"
              className="cursor-pointer text-red-400"
            >
              <Trash size={20} />
            </span>
          )}
          <span
            onClick={() => onView(storeCreateRequest.id)}
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
