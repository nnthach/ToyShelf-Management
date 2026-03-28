"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { WarehouseStaff } from "@/src/types";
import { formatDateTime, formatWarehouseRoleToVN } from "@/src/utils/format";
import { formatSystemRoleColor } from "@/src/utils/formatStatus";

export const getShipperColumns = (): ColumnDef<WarehouseStaff>[] => [
  {
    accessorKey: "fullName",
    header: "Tên đầy đủ",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "warehouseName",
    header: "Kho làm việc",
  },

  {
    accessorKey: "warehouseRole",
    header: "Chức vụ",
    cell: ({ row }) => {
      const role = row.getValue("warehouseRole") as string;

      return (
        <span className={`${formatSystemRoleColor(role)}`}>
          {formatWarehouseRoleToVN(role)}
        </span>
      );
    },
  },

  // {
  //   accessorKey: "isActive",
  //   header: "Trạng thái",
  //   cell: ({ row }) => {
  //     const status = row.getValue("isActive") as boolean;

  //     return (
  //       <span className={`${formatUserStatusColor(status)}`}>
  //         {formatUserStatusText(status)}
  //       </span>
  //     );
  //   },
  // },

  // {
  //   accessorKey: "createdAt",
  //   header: "Ngày tạo",
  //   cell: ({ row }) => {
  //     const value = row.getValue("createdAt") as string;
  //     return <span>{formatDateTime(value).full}</span>;
  //   },
  // },
  {
    accessorKey: "action",
    header: "Hành động",
    cell: ({ row }) => {
      const user = row.original;
      return <ViewDetailSheet user={user} />;
    },
  },
];
