"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "./button";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  children?: React.ReactNode;
  isLoading?: boolean;
  onPageChange?: (pageIndex: number) => void; // <--- thêm
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
  pageSize = 10,
  isLoading,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // sort
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    // end sort
  });

  return (
    <div>
      <div className="overflow-hidden rounded-md border bg-card">
        {children}
        <Table>
          <TableHeader className="bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-4 border-t">
          {/* LEFT: Info */}
          <div className="text-sm text-muted-foreground">
            Hiển thị{" "}
            <span className="font-medium">
              {table.getState().pagination.pageIndex * pageSize + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * pageSize,
                data.length,
              )}
            </span>{" "}
            / {data.length} mục
          </div>

          {/* RIGHT: Pagination */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                table.previousPage();
                onPageChange?.(table.getState().pagination.pageIndex);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              ←
            </Button>

            {/* Page numbers */}
            {Array.from({ length: table.getPageCount() }, (_, i) => {
              const isActive = i === table.getState().pagination.pageIndex;

              return (
                <Button
                  key={i}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    table.setPageIndex(i);
                    onPageChange?.(i); // <--- gọi callback
                  }}
                  className={`px-3 pb-0.5 ${
                    isActive ? "bg-blue-500 text-white hover:bg-blue-600" : ""
                  }`}
                >
                  {i + 1}
                </Button>
              );
            })}

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                table.nextPage();
                onPageChange?.(table.getState().pagination.pageIndex);
              }}
              disabled={!table.getCanNextPage()}
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
