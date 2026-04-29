"use client";

import { DamageReport } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatDamageReportStatusColor,
  formatDamageReportStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStoreReturnRequestColumn = (
  onEdit: (requestId: string) => void,
): ColumnDef<DamageReport>[] => [
  {
    accessorKey: "code",
    header: "Mã",
    cell: ({ row }) => (
      <span className="font-bold text-gray-900">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "storeName",
    header: "Cửa hàng yêu cầu",
  },

  {
    accessorKey: "type",
    header: "Loại hàng",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const typeConfig: Record<string, { label: string; className: string }> = {
        Product: {
          label: "Sản phẩm",
          className: "bg-blue-100 text-blue-700",
        },
        Shelf: {
          label: "Kệ",
          className: "bg-purple-100 text-purple-700",
        },
        Combined: {
          label: "Hỗn hợp",
          className: "bg-orange-100 text-orange-700",
        },
      };

      const config = typeConfig[type] || {
        label: type,
        className: "bg-gray-100 text-gray-700",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full font-medium ${config.className}`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "isWarrantyClaim",
    header: "Bảo hành",
    cell: ({ row }) => {
      const isWarranty = row.getValue("isWarrantyClaim") as boolean;
      return (
        <span
          className={`font-medium ${isWarranty ? "text-green-600" : "text-gray-400"}`}
        >
          {isWarranty ? "Có bảo hành" : "Không"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <span className={`${formatDamageReportStatusColor(status)}`}>
          {formatDamageReportStatusText(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;

      return <span>{formatDateTime(createdAt).full}</span>;
    },
  },
  {
    accessorKey: "action",
    header: "Thao tác",
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
