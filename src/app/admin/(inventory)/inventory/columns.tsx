"use client";

import { ColumnDef } from "@tanstack/react-table";

import ViewDetailSheet from "./components/ViewDetailSheet";
import { User } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { formatDateTime } from "@/src/utils/format";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getInventoryColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: "productColorId",
    header: "Sản phẩm",
  },
  {
    accessorKey: "dispositionId",
    header: "dispositionId",
  },

  {
    accessorKey: "quantity",
    header: "Số lượng",
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const user = row.original;
      return <ViewDetailSheet user={user} />;
    },
  },
];
