"use client";

import { Shelf } from "@/src/types";
import {
  formatBooleanIsActiveStatusColor,
  formatBooleanIsActiveStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";
import Image from "next/image";

export const getShelfTypeColumns = (
  onViewDetail: (shelfTypeId: string) => void,
): ColumnDef<Shelf>[] => [
  {
    accessorKey: "imageUrl",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const image = row.getValue("imageUrl") as string;

      return (
        <Image
          src={"/images/placeholder.png"}
          alt="Shelf"
          width={50}
          height={50}
          className="object-cover rounded"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên loại kệ",
  },

  {
    accessorKey: "totalLevels",
    header: "Số tầng",
  },

  {
    accessorKey: "width",
    header: "Kích thước (D x R x C)",

    cell: ({ row }) => {
      const { width, depth, height } = row.original;

      return (
        <span>
          {width} x {depth} x {height}
        </span>
      );
    },
  },

  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("isActive") as boolean;

      return (
        <span className={`${formatBooleanIsActiveStatusColor(status)}`}>
          {formatBooleanIsActiveStatusText(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const shelf = row.original;
      return (
        <span
          onClick={() => onViewDetail(shelf?.id)}
          title="Chi tiết"
          className="cursor-pointer text-blue-400"
        >
          <Eye />
        </span>
      );
    },
  },
];
