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

export const getStoreColumns = (
  t: (key: string) => string,
): ColumnDef<Store>[] => [
  {
    accessorFn: (row) => row.images?.[0],
    id: "image",
    header: t("image"),
    cell: ({ getValue }) => (
      <img
        src={getValue() as string}
        className="w-12 h-12 object-cover rounded"
      />
    ),
  },
  {
    accessorKey: "name",
    header: t("name"),
    cell: ({ row }) => {
      const { name, partnerId } = row.original as {
        name: string;
        partnerId: string;
      };

      return (
        <div>
          <p>{name}</p>
          <p>{partnerId}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "storeAddress",
    header: t("address"),
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
    header: t("workingTime"),
    cell: ({ row }) => {
      const { openTime, closeTime, openDay } = row.original;
      return (
        <span>
          {openDay}: {openTime} - {closeTime}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: t("status"),
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
    header: t("action"),
    cell: ({ row }) => {
      const store = row.original;
      return <StoreActionCell id={store.id} />;
    },
  },
];
