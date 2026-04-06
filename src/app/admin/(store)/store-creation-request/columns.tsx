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
  onDelete: (tierId: string) => void,
  onEdit: (tierId: string) => void,
): ColumnDef<Store>[] => [
  {
    accessorKey: "partnerName",
    header: "Đối tác",
    cell: ({ row }) => {
      const { partnerName } = row.original;

      return (
        <p className="text-sm text-gray-900 line-clamp-2 font-medium">
          {partnerName}
        </p>
      );
    },
  },
  {
    accessorKey: "reviewedByUserName",
    header: "Người duyệt đơn",
    cell: ({ row }) => {
      const { reviewedByUserName, reviewedByUserEmail } = row.original;

      return (
        <div className="w-[150px]">
          <p className="text-sm text-gray-900 line-clamp-2 font-medium">
            {reviewedByUserName}
          </p>
          <p className="text-gray-600">{reviewedByUserEmail}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên cửa hàng",
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
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onDelete(storeCreateRequest.id)}
            title="Xóa"
            className="cursor-pointer text-red-400"
          >
            <Trash size={20} />
          </span>
          <span
            onClick={() => onEdit(storeCreateRequest.id)}
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
