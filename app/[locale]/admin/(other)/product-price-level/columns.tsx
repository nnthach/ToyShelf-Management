"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductCategory, User } from "@/shared/types";
import ViewDetailSheet from "./components/ViewDetailSheet";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductCategoryColumns = (
  t: (key: string) => string
): ColumnDef<ProductCategory>[] => [
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
      const productCategory = row.original;
      return <ViewDetailSheet productCategory={productCategory} />;
    },
  },
];
