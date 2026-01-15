"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order, ProductColor } from "@/shared/types";
import ViewDetailSheet from "./components/ViewDetailSheet";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getOrderColumns = (
  t: (key: string) => string
): ColumnDef<Order>[] => [
  {
    accessorKey: "storeId",
    header: t("storeId"),
  },

  // {
  //   accessorKey: "isActive",
  //   header: t("status"),
  //   cell: ({ row }) => {
  //     const status = row.getValue("isActive") as boolean;

  //     return (
  //       <span className={`${formatUserStatusColor(status)}`}>
  //         {formatUserStatusText(status)}
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const order = row.original;
      return <ViewDetailSheet order={order} />;
    },
  },
];
