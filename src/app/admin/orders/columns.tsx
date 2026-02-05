"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { Order } from "@/src/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getOrderColumns = (): ColumnDef<Order>[] => [
  {
    accessorKey: "storeId",
    header: "ID Cửa hàng",
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const order = row.original;
      return <ViewDetailSheet order={order} />;
    },
  },
];
