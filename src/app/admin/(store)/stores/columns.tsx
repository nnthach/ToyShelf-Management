"use client";

import { Store } from "@/src/types";
import {
  formatStoreStatusColor,
  formatStoreStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

function StoreActionCell({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/admin/stores/${id}`)}
      title="Detail"
      className="text-blue-500 hover:text-blue-700"
    >
      <Eye size={18} />
    </button>
  );
}

export const getStoreColumns = (): ColumnDef<Store>[] => [
  {
    accessorKey: "name",
    header: "Đối tác",
  },
  {
    accessorKey: "name",
    header: "Tên cửa hàng",
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
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
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;

      return (
        <span className={`${formatStoreStatusColor(isActive)}`}>
          {formatStoreStatusText(isActive)}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const store = row.original;
      return <StoreActionCell id={store.id} />;
    },
  },
];
