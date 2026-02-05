"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { ProductColor } from "@/src/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductColorColumns = (): ColumnDef<ProductColor>[] => [
  {
    accessorKey: "name",
    header: "Tên",
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
    header: "Hành động",
    cell: ({ row }) => {
      const productColor = row.original;
      return <ViewDetailSheet productColor={productColor} />;
    },
  },
];
