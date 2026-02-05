"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { ProductCategory } from "@/src/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getProductCategoryColumns = (): ColumnDef<ProductCategory>[] => [
  {
    accessorKey: "name",
    header: "Tên",
  },

  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const productCategory = row.original;
      return <ViewDetailSheet productCategory={productCategory} />;
    },
  },
];
