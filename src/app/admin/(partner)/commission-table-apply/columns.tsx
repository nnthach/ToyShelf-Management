"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CommissionTableApply } from "@/src/types";
import { Edit } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getCommissionTableApplyColumns = (
  onEdit: (commissionPolicyId: string) => void,
): ColumnDef<CommissionTableApply>[] => [
  {
    accessorKey: "partnerName",
    header: "Đối tác",
  },

  {
    accessorKey: "commissionTableName",
    header: "Bảng hoa hồng",
  },

  {
    accessorKey: "name",
    header: "Tên",
  },

  {
    accessorKey: "startDate",
    header: "Ngày bắt đầu",
    cell: ({ row }) => {
      const commissionTableApply = row.original;
      return new Date(commissionTableApply.startDate).toLocaleDateString(
        "vi-VN",
      );
    },
  },

  {
    accessorKey: "endDate",
    header: "Ngày kết thúc",
    cell: ({ row }) => {
      const commissionTableApply = row.original;
      return new Date(commissionTableApply.endDate).toLocaleDateString("vi-VN");
    },
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const commissionPolicy = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onEdit(commissionPolicy.id)}
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
