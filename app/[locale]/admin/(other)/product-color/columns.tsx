"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductColor } from "@/shared/types";
import ViewDetailSheet from "./components/ViewDetailSheet";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductColorColumns = (
  t: (key: string) => string
): ColumnDef<ProductColor>[] => [
  {
    accessorKey: "name",
    header: t("name"),
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
      const productColor = row.original;
      return <ViewDetailSheet productColor={productColor} />;
    },
  },
];
