"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CommissionTableApply } from "@/src/types";
import { Edit, Lock, Unlock } from "lucide-react";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getCommissionTableApplyColumns = (
  handleRestore: (commissionId: string) => void,
  handleDisable: (commissionId: string) => void,
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
    header: "Ghi chú",
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
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("isActive") as boolean;

      return (
        <span className={`${formatUserStatusColor(status)}`}>
          {formatUserStatusText(status)}
        </span>
      );
    },
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const commission = row.original;
      return (
        <div className="flex items-center gap-3">
          {!commission?.isActive ? (
            <span
              onClick={() => handleRestore(commission.id)}
              title="Kích hoạt"
              className="cursor-pointer text-blue-400"
            >
              <Unlock size={20} />
            </span>
          ) : (
            <span
              onClick={() => handleDisable(commission.id)}
              title="Vô hiệu hóa"
              className="cursor-pointer text-red-400"
            >
              <Lock size={20} />
            </span>
          )}
        </div>
      );
    },
  },
];
