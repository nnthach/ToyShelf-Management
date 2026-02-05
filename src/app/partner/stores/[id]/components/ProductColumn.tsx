"use client";

import { Product } from "@/src/types";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

function ProductActionCell({
  product,
  onView,
}: {
  product: Product;
  onView: (product: Product) => void;
}) {
  return (
    <button
      onClick={() => onView(product)}
      title="Detail"
      className="text-blue-500 hover:text-blue-700"
    >
      <Eye size={18} />
    </button>
  );
}

export const getProductColumns = (
  t: (key: string) => string,
  onView: (product: Product) => void,
): ColumnDef<Product>[] => [
  {
    accessorKey: "title",
    header: t("title"),
  },

  {
    accessorKey: "stock",
    header: t("stock"),
  },

  {
    accessorKey: "action",
    header: t("action"),
    cell: ({ row }) => {
      const product = row.original;
      return <ProductActionCell product={product} onView={onView} />;
    },
  },
];
