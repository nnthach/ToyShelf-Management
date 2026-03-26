"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CommissionPolicy } from "@/src/types";
import { Edit, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getCommissionPolicyColumns = (
  onEdit: (commissionPolicyId: string) => void,
): ColumnDef<CommissionPolicy>[] => [
  {
    accessorKey: "partnerTierName",
    header: "Cấp bậc đối tác",
  },

  {
    accessorKey: "priceSegmentName",
    header: "Phân khúc giá",
  },

  {
    accessorKey: "commissionRate",
    header: "Tỷ lệ hoa hồng",
    cell: ({ row }) => {
      const commissionPolicy = row.original;
      return `${(commissionPolicy.commissionRate * 100).toFixed(0)}%`;
    },
  },

  {
    accessorKey: "effectiveDate",
    header: "Ngày hiệu lực",
    cell: ({ row }) => {
      const commissionPolicy = row.original;
      return new Date(commissionPolicy.effectiveDate).toLocaleDateString(
        "vi-VN",
      );
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
