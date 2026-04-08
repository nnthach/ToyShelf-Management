"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PartnerTier } from "@/src/types";
import { Edit, Trash } from "lucide-react";
import { formatPartnerTierTextColor } from "@/src/utils/formatStatus";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getPartnerTierColumns = (
  onEdit: (tierId: string) => void,
  onDelete: (tierId: string) => void,
): ColumnDef<PartnerTier>[] => [
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;

      return (
        <div className="flex items-center">
          <span
            className={`font-bold text-xs shadow-sm border border-black/5 whitespace-nowrap ${formatPartnerTierTextColor(name)}`}
          >
            {name}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "priority",
    header: "Ưu tiên",
  },

  {
    accessorKey: "maxShelvesPerStore",
    header: "Số lượng kệ tối đa mỗi cửa hàng",
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const partnerTier = row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            onClick={() => onDelete(partnerTier.id)}
            title="Xóa"
            className="cursor-pointer text-red-400"
          >
            <Trash size={20} />
          </span>
          <span
            onClick={() => onEdit(partnerTier.id)}
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
