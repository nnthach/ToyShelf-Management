"use client";

import { User } from "@/src/types";
import { formatDateTime } from "@/src/utils/format";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const ActionCell = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <span
      onClick={() => router.push(`/admin/partners/${id}`)}
      className="cursor-pointer text-blue-400"
    >
      <Eye />
    </span>
  );
};

export const getPartnerColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: "Tên đầy đủ",
    cell: ({ row }) => {
      const fullname = row.getValue("fullName") as string;
      const email = row.getValue("email") as string;
      return (
        <div>
          <span>{fullname || "Chưa có tên"}</span>
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
    cell: ({ row }) => <ActionCell id={row.original.id} />,
  },
];
