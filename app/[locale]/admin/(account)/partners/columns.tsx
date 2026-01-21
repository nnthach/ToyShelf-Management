"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/shared/types";
import { formatDateTime } from "../../../../../shared/utils/format";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "../../../../../shared/utils/formatStatus";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { Eye } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getPartnerColumns = (
  t: (key: string) => string,
  onViewDetail: (partnerId: string) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: t("fullName.label"),
    cell: ({ row }) => {
      const fullname = row.getValue("fullName") as string;
      const email = row.getValue("email") as string;
      return (
        <div>
          <span>{fullname}</span>
          <span>{email}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "companyName",
    header: t("companyName.label"),
  },

  {
    accessorKey: "tier",
    header: t("tier.label"),
  },

  {
    accessorKey: "isActive",
    header: t("isActive.label"),
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
    header: t("createdAt.label"),
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return <span>{formatDateTime(value).full}</span>;
    },
  },
  {
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const partner = row.original;
      // return <ViewDetailSheet partnerId={partner.id} />;
      return (
        <span
          onClick={() => onViewDetail(partner.id)}
          title="Detail"
          className="cursor-pointer text-blue-400"
        >
          <Eye />
        </span>
      );
    },
  },
];
