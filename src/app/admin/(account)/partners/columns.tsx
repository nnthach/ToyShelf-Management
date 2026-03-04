"use client";

import { User } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getPartnerColumns = (
  onViewDetail: (partnerId: string) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: "Tên đầy đủ",
    cell: ({ row }) => {
      const fullname = row.getValue("fullName") as string;
      const email = row.getValue("email") as string;
      return (
        <div>
          <span>{fullname || 'Chưa có tên'}</span>
          <span>{email}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "companyName",
    header: "Tên công ty",
  },

  {
    accessorKey: "partnerTierName",
    header: "Cấp bậc",
  },

  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;

      return (
        <span className={`${formatUserStatusColor(isActive)}`}>
          {formatUserStatusText(isActive)}
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return <span>{formatDateTime(value).full}</span>;
    },
  },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <span
          onClick={() => onViewDetail(partner.id)}
          title="Detail"
          className="cursor-pointer text-blue-400"
        >
          <Eye />
        </span>
      );
    },
  },
];
