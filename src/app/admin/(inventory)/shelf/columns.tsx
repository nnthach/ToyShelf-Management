"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ShelfShelf } from "@/src/types";
import {
  formatShelfStatusColor,
  formatShelfStatusText,
} from "@/src/utils/formatStatus";
import { useShelfDetailSheet } from "@/src/context/ShelfDetailSheetContext";
import { Eye } from "lucide-react";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const ActionCell = ({ shelfId }: { shelfId: string }) => {
  const { openById } = useShelfDetailSheet();

  return (
    <button
      title="Detail"
      className="p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-500"
      onClick={() => openById(shelfId)}
    >
      <Eye size={20} />
    </button>
  );
};

export const getShelfColumns = (): ColumnDef<ShelfShelf>[] => [
  {
    accessorKey: "code",
    header: "Mã kệ",
    cell: ({ row }) => {
      const { code } = row.original;
      return <p className="font-bold">{code}</p>;
    },
  },
  {
    accessorKey: "shelfType",
    id: "shelfTypeName",
    header: "Loại kệ",
    cell: ({ row }) => {
      const { shelfType } = row.original;
      return <p>{shelfType?.name}</p>;
    },
  },
  {
    accessorKey: "shelfType",
    id: "shelfTypeImage",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const { shelfType } = row.original;
      const imageUrl = shelfType?.imageUrl;

      return (
        <div className="relative w-16 h-16 overflow-hidden rounded-lg border border-gray-100 shadow-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={shelfType?.name || "Shelf Image"}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
              No Image
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "shelfType",
    id: "shelfTypeSize",
    header: "Kích thước",
    cell: ({ row }) => {
      const { shelfType } = row.original;
      return (
        <p className="font-medium text-sm text-gray-600">
          {shelfType?.width} x {shelfType?.height} x {shelfType?.depth} cm
        </p>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <span className={`${formatShelfStatusColor(status)}`}>
          {formatShelfStatusText(status)}
        </span>
      );
    },
  },

  {
    accessorKey: "action",
    header: "Thao tác",
    cell: ({ row }) => {
      const shelfId = row.original.shelfType?.id;

      if (!shelfId) return null;

      return <ActionCell shelfId={shelfId} />;
    },
  },
];
