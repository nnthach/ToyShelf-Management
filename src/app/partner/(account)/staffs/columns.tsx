"use client";

import { User } from "@/src/types";
import { formatDateTime, formatStoreRoleToVN } from "@/src/utils/format";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { ColumnDef } from "@tanstack/react-table";

import { Eye, Lock, UnlockIcon } from "lucide-react";
import { Unlock } from "next/font/google";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getStaffColumns = (
  onDisable: (staffId: string) => void,
  onRestore: (staffId: string) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: "Tên đầy đủ",
    cell: ({ row }) => {
      const fullName = row.getValue("fullName") as string;

      return <p className={`font-bold`}>{fullName}</p>;
    },
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "storeName",
    header: "Cửa hàng",
  },

  {
    accessorKey: "storeRole",
    header: "Chức vụ",
    cell: ({ row }) => {
      const storeRole = row.getValue("storeRole") as string;

      return (
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
            storeRole === "Manager"
              ? "bg-amber-100/50 text-amber-700 border border-amber-200/50"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {formatStoreRoleToVN(storeRole)}
        </span>
      );
    },
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
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const staff = row.original;

      return staff?.isActive ? (
        <span
          onClick={() => onDisable(staff.id)}
          title="Disable"
          className="cursor-pointer text-red-400"
        >
          <Lock />
        </span>
      ) : (
        <span
          onClick={() => onRestore(staff.id)}
          title="Kích hoạt"
          className="cursor-pointer text-green-400"
        >
          <UnlockIcon />
        </span>
      );
    },
  },
];
